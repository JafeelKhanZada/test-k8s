export interface IAlkaramTest {
  serverConnection: boolean;
  databaseConnection: boolean;
  output: string;
}

export interface IAlkaramQueryResponse {
  status: boolean;
  message: string;
  insertedId?: string;
}

export interface IAlkaramAddTransactionPayload {
  cnic: string;
  transactionDate: Date;
  amount: number;
}

export interface IAlkaramDeleteTransactionPayload {
  id: string;
}

export interface IAlkaramSearchTransactionsPayload {
  cnic: string;
}

export interface IAlkaramSearchUsersPayload {
  cnic?: string;
  joiningDate: Date;
  lastUpdatedDate: Date;
  page?: number;
  limit?: number;
  disabled?: string;
  count?: string;
  action?: string;
}
