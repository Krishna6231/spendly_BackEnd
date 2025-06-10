import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';

@Controller('expense')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
  ) {}

  @Post('add')
  async addExpense(@Body() data: any, @Req() req) {
    data.id = req.user.id;
    return this.expenseService.addExpense(data);
  }

  @Get('user')
  getExpensesByUserId(@Req() req) {
    const userId = req.user.id; 
    return this.expenseService.getExpensesByUserId(userId);
  }

  @Post('add-category')
  async addCategory(
    @Body() body: { category: string; limit: number; color: string },
    @Req() req,
  ) {
    const { category, limit, color } = body;
    return this.expenseService.addCategory(req.user.id, category, limit, color);
  }

  @Post('delete-category')
  async deleteCategory(@Body() body: { category: string }, @Req() req) {
    return this.expenseService.deleteCategory(req.user.id, body.category);
  }

  @Put('edit-category')
  async editCategoryLimit(
    @Body() body: { category: string; limit: number; color: string },
    @Req() req,
  ) {
    return this.expenseService.editCategoryLimit(
      req.user.id,
      body.category,
      body.limit,
      body.color,
    );
  }

  @Delete('delete')
  async deleteExpense(
    @Query('expenseId') expenseId: string,
    @Req() req,
  ) {
    return this.expenseService.deleteExpense(expenseId, req.user.id);
  }

   @Post('add-subscription')
  async addSubscription(
    @Body()
    body: {
      subscription: string;
      amount: number;
      autopay_date: number;
    },
    @Req() req,
  ) {
    const { subscription, amount, autopay_date } = body;
    return this.expenseService.addSubscription(
      req.user.id,
      subscription,
      amount,
      autopay_date,
    );
  }

  @Post('delete-subscription')
  async deleteSubscription(
    @Body() body: { subscription: string },
    @Req() req,
  ) {
    return this.expenseService.deleteSubscription(req.user.id, body.subscription);
  }

  @Put('edit-subscription')
  async editSubscription(
    @Body()
    body: {
      subscription: string;
      amount: number;
      autopay_date: number;
    },
    @Req() req,
  ) {
    return this.expenseService.editSubscription(
      req.user.id,
      body.subscription,
      body.amount,
      body.autopay_date,
    );
  }
}
