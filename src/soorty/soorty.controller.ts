import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SoortyService } from './soorty.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ISoortyAddTransactionPayload,
  ISoortyDeleteTransactionPayload,
  ISoortyQueryResponse,
  ISoortySearchTransactionsPayload,
  ISoortySearchUsersPayload,
  ISoortyTest,
} from 'src/types/soorty.types';

@Controller('soorty')
@UseGuards(ThrottlerGuard)
export class SoortyController {
  constructor(private readonly service: SoortyService) {}

  @Get('transactions')
  async searchTransactions(
    @Query() query: ISoortySearchTransactionsPayload,
  ): Promise<any> {
    console.log('searchTransactions Controller');
    return this.service.production().searchTransactions(query.cnic);
  }

  @Get('dev/transactions')
  async searchTransactionsDev(
    @Query() query: ISoortySearchTransactionsPayload,
  ): Promise<any> {
    console.log('searchTransactionsDev Controller');
    return this.service.development().searchTransactions(query.cnic);
  }

  @Get('user')
  async searchUsers(@Query() query: ISoortySearchUsersPayload): Promise<any> {
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
      );
  }

  @Get('dev/user')
  async searchUsersDev(
    @Query() query: ISoortySearchUsersPayload,
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
      );
  }

  @Get('transaction')
  async addTransaction(
    @Query() transaction: ISoortyAddTransactionPayload,
  ): Promise<ISoortyQueryResponse> {
    console.log('addTransaction Controller');
    return this.service.production().addTransaction(transaction);
  }

  @Get('dev/transaction')
  async addTransactionDev(
    @Query() transaction: ISoortyAddTransactionPayload,
  ): Promise<ISoortyQueryResponse> {
    console.log('addTransactionDev Controller');
    return this.service.development().addTransaction(transaction);
  }

  @Get('deleteTransaction')
  async deleteTransaction(
    @Query() transaction: ISoortyDeleteTransactionPayload,
  ): Promise<ISoortyQueryResponse> {
    console.log('deleteTransaction Controller');
    return this.service.production().deleteTransaction(transaction);
  }

  @Get('dev/deleteTransaction')
  async deleteTransactionDev(
    @Query() transaction: ISoortyDeleteTransactionPayload,
  ): Promise<ISoortyQueryResponse> {
    console.log('deleteTransactionDev Controller');
    return this.service.development().deleteTransaction(transaction);
  }

  @Get('test')
  async getTest(): Promise<ISoortyTest> {
    console.log('getTest Controller');
    return this.service.production().getTest();
  }

  @Get('dev/test')
  async getTestDev(): Promise<ISoortyTest> {
    console.log('getTestDev Controller');
    return this.service.development().getTest();
  }
}
