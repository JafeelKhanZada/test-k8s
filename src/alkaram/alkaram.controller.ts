import { Controller, Get, Query } from '@nestjs/common';
import {
  IAlkaramSearchTransactionsPayload,
  IAlkaramSearchUsersPayload,
  IAlkaramAddTransactionPayload,
  IAlkaramQueryResponse,
  IAlkaramDeleteTransactionPayload,
  IAlkaramTest,
} from 'src/types/alkaram.types';
import { AlkaramService } from './alkaram.service';

@Controller('alkaram')
export class AlkaramController {
  constructor(private readonly service: AlkaramService) {}

  @Get('transactions')
  async searchTransactions(
    @Query() query: IAlkaramSearchTransactionsPayload,
  ): Promise<any> {
    console.log('searchTransactions Controller');
    return this.service.production().searchTransactions(query.cnic);
  }

  @Get('dev/transactions')
  async searchTransactionsDev(
    @Query() query: IAlkaramSearchTransactionsPayload,
  ): Promise<any> {
    console.log('searchTransactionsDev Controller');
    return this.service.development().searchTransactions(query.cnic);
  }

  @Get('user')
  async searchUsers(@Query() query: IAlkaramSearchUsersPayload): Promise<any> {
    console.log('searchUsers Controller');
    return this.service
      .production()
      .searchUsers(
        query?.cnic,
        query?.joiningDate,
        query?.lastUpdatedDate,
        query?.disabled,
        query?.page,
        query?.limit,
        query?.count,
        query?.action,
      );
  }

  @Get('dev/user')
  async searchUsersDev(
    @Query() query: IAlkaramSearchUsersPayload,
  ): Promise<any> {
    console.log('searchUsersDev Controller');
    return this.service
      .development()
      .searchUsers(
        query?.cnic,
        query?.joiningDate,
        query?.lastUpdatedDate,
        query?.disabled,
        query?.page,
        query?.limit,
        query?.count,
        query?.action,
      );
  }

  @Get('transaction')
  async addTransaction(
    @Query() transaction: IAlkaramAddTransactionPayload,
  ): Promise<IAlkaramQueryResponse> {
    console.log('addTransaction Controller');
    return this.service.production().addTransaction(transaction);
  }

  @Get('dev/transaction')
  async addTransactionDev(
    @Query() transaction: IAlkaramAddTransactionPayload,
  ): Promise<IAlkaramQueryResponse> {
    console.log('addTransactionDev Controller');
    return this.service.development().addTransaction(transaction);
  }

  @Get('deleteTransaction')
  async deleteTransaction(
    @Query() transaction: IAlkaramDeleteTransactionPayload,
  ): Promise<IAlkaramQueryResponse> {
    console.log('deleteTransaction Controller');
    return this.service.production().deleteTransaction(transaction);
  }

  @Get('dev/deleteTransaction')
  async deleteTransactionDev(
    @Query() transaction: IAlkaramDeleteTransactionPayload,
  ): Promise<IAlkaramQueryResponse> {
    console.log('deleteTransactionDev Controller');
    return this.service.development().deleteTransaction(transaction);
  }

  @Get('test')
  async getTest(): Promise<IAlkaramTest> {
    console.log('getTest Controller');
    return this.service.production().getTest();
  }

  @Get('dev/test')
  async getTestDev(): Promise<IAlkaramTest> {
    console.log('getTestDev Controller');
    return this.service.development().getTest();
  }
}
