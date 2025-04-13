import { Controller, Post, Body } from '@nestjs/common';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('add')
  async addExpense(
    @Body() data: any
  ) {
    return this.expenseService.addExpense(data);
  }
  
  
}
