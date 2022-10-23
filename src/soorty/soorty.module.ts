import { Module } from '@nestjs/common';
import { SoortyService } from './soorty.service';
import { SoortyController } from './soorty.controller';

@Module({
  controllers: [SoortyController],
  providers: [SoortyService],
})
export class SoortyModule {}
