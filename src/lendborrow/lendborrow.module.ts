import { Module } from '@nestjs/common';
import { LendBorrowService } from './lendborrow.service';
import { LendBorrowController } from './lendborrow.controller';

@Module({
  controllers: [LendBorrowController],
  providers: [LendBorrowService],
})
export class LendBorrowModule {}
