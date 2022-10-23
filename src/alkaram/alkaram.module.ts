import { Module } from '@nestjs/common';
import { AlkaramController } from './alkaram.controller';
import { AlkaramService } from './alkaram.service';

@Module({
  controllers: [AlkaramController],
  providers: [AlkaramService],
})
export class AlkaramModule {}
