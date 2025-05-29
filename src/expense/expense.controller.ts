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

  @Post('add-subscription')
  async addSubscription(@Body() body: { user_id: string; subscription: string; amount: number; autopay_date: number; }) {
    const { user_id, subscription, amount, autopay_date } = body;
    return this.expenseService.addSubscription(user_id, subscription, amount, autopay_date);
  }

  @Post('delete-subscription')
  async deleteSubscription(@Body() body: { user_id: string; subscription: string; }) {
    const { user_id, subscription } = body;
    return this.expenseService.deleteSubscription(user_id, subscription);
  }

  @Put('edit-subscription')
  async editSubscription(@Body() body: { user_id: string; subscription: string; amount: number, autopay_date: number }) {
    return this.expenseService.editSubscription(body.user_id, body.subscription, body.amount, body.autopay_date);
  }
  
}
