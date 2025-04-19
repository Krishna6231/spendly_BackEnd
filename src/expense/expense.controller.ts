import { Controller, Post, Get, Query, Body, Put } from '@nestjs/common';
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

  @Post('add-category')
  async addCategory(@Body() body: { user_id: string; category: string; limit: number }) {
    const { user_id, category, limit } = body;
    return this.expenseService.addCategory(user_id, category, limit);
  }

  @Put('edit-category')
  async editCategoryLimit(@Body() body: { user_id: string; category: string; limit: number }) {
    return this.expenseService.editCategoryLimit(body.user_id, body.category, body.limit);
  }
  
}
