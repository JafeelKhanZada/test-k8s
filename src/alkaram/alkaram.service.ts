import { Injectable } from '@nestjs/common';
import { Connection, OUT_FORMAT_OBJECT, getConnection } from 'oracledb';
import { sleep, replaceAllExceptFirst, ping } from 'src/helpers/util';
import {
  IAlkaramAddTransactionPayload,
  IAlkaramQueryResponse,
  IAlkaramDeleteTransactionPayload,
  IAlkaramTest,
} from 'src/types/alkaram.types';

@Injectable()
export class AlkaramService {
  private retry = 3; // Retries to connect database
  private dbConnection: Connection;
  private tables = {
    TRANSACTION_TABLE: 'HRM_ADVANCE_SANCTIONED'.toLocaleLowerCase(),
    USER_TABLE: 'HRM_ADVANCE_USER_INFO'.toLocaleLowerCase(),
  };
  private dev = false; // Dev environment
  private resetConnection = false;

  /**
   * This will run query and return result
   * @param sql query to run
   */
  async query(sql: string): Promise<any> {
    let retry = 3;
    do {
      // For every other retry, it will try to forcefully connect database
      const connection = await this.connect(retry > 1);

      if (connection) {
        console.log(`QUERY${this.dev ? ':DEV' : ''} (try: ${retry}): ${sql}`);

        try {
          const result = await this.dbConnection.execute(sql, [], {
            outFormat: OUT_FORMAT_OBJECT,
          });
          this.dbConnection.commit();

          console.table(result);
          return result;
        } catch (error) {
          console.log(error.message);
        }
      }

      retry++;
      this.dbConnection = undefined;

      await sleep(1);
    } while (retry <= this.retry);
    return null;
  }

  /**
   * This will add a new transaction
   * @param transaction
   * @returns true if query executed successfully, false if it failed
   */
  async addTransaction(
    transaction: IAlkaramAddTransactionPayload,
  ): Promise<IAlkaramQueryResponse> {
    console.log('addTransaction Service');

    let response: IAlkaramQueryResponse;

    const result = await this.query(
      `INSERT INTO ${this.tables.TRANSACTION_TABLE}
        (
          CNIC, 
          SANCTIONED_DATE, 
          SANCTIONED_AMOUNT, 
          LAST_UPDATE_DATE
        ) 
        VALUES(
          '${transaction.cnic}', 
          TO_DATE('${transaction.transactionDate}', 'yyyy/mm/dd hh24:mi:ss') + 5 / 24, 
          '${transaction.amount}', 
          TO_DATE('${transaction.transactionDate}', 'yyyy/mm/dd hh24:mi:ss') + 5 / 24
        )`,
    );

    const inserted = result?.rowsAffected > 0;

    if (inserted) {
      const row = await this.query(
        `SELECT * FROM ${this.tables.TRANSACTION_TABLE} where CNIC = '${transaction.cnic}' AND ROWNUM = 1 ORDER BY LAST_UPDATE_DATE DESC `,
      );

      response = {
        status: true,
        insertedId: row?.rows[0]?.ADV_TRANS_ID,
        message: 'Record inserted successfully!',
      };
    } else {
      response = {
        status: false,
        message: 'Record is not inserted!',
      };
    }

    return response;
  }

  /**
   * This will delete a transaction
   * @param transaction
   * @returns true if query executed successfully, false if it failed
   */
  async deleteTransaction(
    transaction: IAlkaramDeleteTransactionPayload,
  ): Promise<IAlkaramQueryResponse> {
    console.log('deleteTransaction Service');

    const result = await this.query(
      `DELETE FROM ${this.tables.TRANSACTION_TABLE} WHERE ADV_TRANS_ID = '${transaction.id}'`,
    );

    const deleted = result?.rowsAffected > 0;

    const response: IAlkaramQueryResponse = {
      status: deleted,
      message: deleted
        ? 'Record deleted successfully!'
        : 'Record is not deleted!',
    };

    return response;
  }

  /**
   *
   * @param cnic CNIC of user to get transactions
   * @returns
   */
  async searchTransactions(cnic: string): Promise<any[]> {
    console.log('searchTransactions Service');

    let result: any;

    if (!cnic) {
      result = await this.query(
        `SELECT * FROM ${this.tables.TRANSACTION_TABLE}`,
      );
    } else {
      result = await this.query(
        `SELECT * FROM ${this.tables.TRANSACTION_TABLE} WHERE CNIC = '${cnic}'`,
      );
    }

    return result?.rows ?? [];
  }

  /**
   *
   * @param cnic CNIC of user
   * @param joiningDate
   * @param lastUpdatedDate
   * @param disabled
   * @param page
   * @param limit
   * @param count
   * @param action
   * @returns
   */
  async searchUsers(
    cnic = '',
    joiningDate: Date = null,
    lastUpdatedDate: Date = null,
    disabled: string = null,
    page = 1,
    limit = 10,
    count = 'N',
    action = null,
  ): Promise<any[]> {
    console.log('searchUsers Service');
    let sub = `SELECT e.*, ROWNUM rnum FROM ${this.tables.USER_TABLE} e `;

    if (cnic) sub += ` WHERE CNIC = '${cnic}' `;
    if (joiningDate)
      sub += ` WHERE DATE_OF_JOIN >= TO_DATE('${joiningDate}', 'yyyy/mm/dd hh24:mi:ss') `;

    if (lastUpdatedDate)
      sub += ` WHERE LAST_UPDATED_DATE > '${lastUpdatedDate}'`;

    if (disabled) sub += ` WHERE DISABLED = '${disabled}' `;
    if (action === 'new') sub += 'ORDER BY DATE_OF_JOIN';

    sub = replaceAllExceptFirst(sub, 'WHERE', 'AND');

    const offset = page * limit - limit + 1;

    // Oracle doesn't support limit and offset
    // FETCH FIRST 1 ROW ONLY also not working here
    // Have to use sub query trick for that
    const query = `SELECT ${count === 'Y' ? 'COUNT(*) as total' : '*'}
    FROM (${sub})
    WHERE rnum >= ${offset} AND rnum < ${+limit + +offset}`;

    const result = await this.query(query);

    return result?.rows ?? [];
  }

  /**
   * This will establish a connection with oracle database.
   * @returns true if connection established, false if connection is not established
   */
  async connect(force = false): Promise<boolean> {
    if (!force && !this.resetConnection && this.dbConnection) {
      console.log(`Connection already established!`);
      return true;
    }

    this.resetConnection = false;

    const ALKARAM_DB_USER = this.dev
      ? process.env.ALKARAM_DB_USER_DEV
      : process.env.ALKARAM_DB_USER;
    const ALKARAM_DB_PASSWORD = this.dev
      ? process.env.ALKARAM_DB_PASSWORD_DEV
      : process.env.ALKARAM_DB_PASSWORD;
    const ALKARAM_HOST = this.dev
      ? process.env.ALKARAM_HOST_DEV
      : process.env.ALKARAM_HOST;
    const ALKARAM_SERVICE_NAME = this.dev
      ? process.env.ALKARAM_SERVICE_NAME_DEV
      : process.env.ALKARAM_SERVICE_NAME;

    console.log(`Connecting ${ALKARAM_HOST}....`);

    try {
      this.dbConnection = await getConnection({
        user: ALKARAM_DB_USER,
        password: ALKARAM_DB_PASSWORD,
        connectionString: `${ALKARAM_HOST}/${ALKARAM_SERVICE_NAME}`,
      });

      if (!this.dbConnection) {
        throw new Error(
          `Not able to connect with ${ALKARAM_HOST}${this.dev ? ' (DEV)' : ''}`,
        );
      }

      console.log(
        `Successfully connected to Oracle Database on ${ALKARAM_HOST}${
          this.dev ? ' (DEV)' : ''
        }`,
      );

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Disconnect current connectin with Oracle Database
   */
  async disconnect(): Promise<void> {
    if (this.dbConnection) {
      try {
        await this.dbConnection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }

  /**
   * This will check if server is pinging and database connection can be established or not
   * @returns status of server and database connection
   */
  async getTest(): Promise<IAlkaramTest> {
    console.log('getTest Service');

    let serverTest = false;
    let dbTest = false;
    let output = '';
    const ALKARAM_HOST = this.dev
      ? process.env.ALKARAM_HOST_DEV
      : process.env.ALKARAM_HOST;

    // Testing server connection
    try {
      console.log(`Testing server ${ALKARAM_HOST} ${this.dev ? ' (DEV)' : ''}`);
      const result = await ping(ALKARAM_HOST, 2);

      if (result?.error) {
        throw new Error(
          ` -- Couldn't ping server ${ALKARAM_HOST}${
            this.dev ? ' (DEV)' : ''
          } -- `,
        );
      }

      output += result.output;
      serverTest = true;

      console.log(
        `- Testing database connection ${ALKARAM_HOST}${
          this.dev ? ' (DEV)' : ''
        }`,
      );
      const connection = await this.connect();
      if (!connection) {
        throw new Error(
          ` -- Database couldn't be connected at ${ALKARAM_HOST}${
            this.dev ? ' (DEV)' : ''
          }`,
        );
      } else {
        output += `- DATABASE CONNECTED -`;
        await this.disconnect();
      }

      dbTest = true;
    } catch (error) {
      output += `Error in Alkaram Test: - ${error.message} `;
    }

    return {
      serverConnection: serverTest,
      databaseConnection: dbTest,
      output,
    };
  }

  development() {
    if (!this.dev) this.resetConnection = true;
    this.dev = true;
    return this;
  }

  production() {
    if (this.dev) this.resetConnection = true;
    this.dev = false;
    return this;
  }
}
