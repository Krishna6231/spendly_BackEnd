import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('add')
  async addExpense(@Body() data: any) {
    return this.expenseService.addExpense(data);
  }

  @Get('user')
  async getExpensesByUserId(@Query('userid') userid: string) {
    return this.expenseService.getExpensesByUserId(userid);
  }
  
}
