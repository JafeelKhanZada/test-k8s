export interface ISoortyTest {
  serverConnection: boolean;
  databaseConnection: boolean;
  output: string;
}

export interface ISoortyQueryResponse {
  status: boolean;
  message: string;
  insertedId?: string;
}

export interface ISoortyAddTransactionPayload {
  cnic: string;
  transactionDate: Date;
  amount: number;
}

export interface ISoortyDeleteTransactionPayload {
  id: string;
}

export interface ISoortySearchTransactionsPayload {
  cnic: string;
}

export interface ISoortySearchUsersPayload {
  cnic?: string;
  joiningDate: Date;
  lastUpdatedDate: Date;
  page?: number;
  limit?: number;
  disabled?: string;
  count?: string;
}
