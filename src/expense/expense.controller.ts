import { Controller, Post, Get, Query, Body, Put, Delete } from '@nestjs/common';
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
  async addCategory(@Body() body: { user_id: string; category: string; limit: number, color: string }) {
    const { user_id, category, limit, color } = body;
    return this.expenseService.addCategory(user_id, category, limit, color);
  }

  @Post('delete-category')
  async deleteCategory(@Body() body: { user_id: string; category: string; }) {
    const { user_id, category } = body;
    return this.expenseService.deleteCategory(user_id, category);
  }

  @Put('edit-category')
  async editCategoryLimit(@Body() body: { user_id: string; category: string; limit: number, color: string }) {
    return this.expenseService.editCategoryLimit(body.user_id, body.category, body.limit, body.color);
  }

  @Delete('delete')
  async deleteExpense(
    @Query('expenseId') expenseId: string,
    @Query('userId') userId: string
  ) {
    return this.expenseService.deleteExpense(expenseId, userId);
  }
  
}
