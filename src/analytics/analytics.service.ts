import { Injectable } from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { ExpenseEntity } from '../database/entity/expense.entity';
import { ExpenseSchema } from '../database/schema/expense.schema';
import { UserEntity } from 'src/database/entity/user.entity';
import { UserSchema } from 'src/database/schema/user.schema';
import { CategoryEntity } from 'src/database/entity/category.entity';
import { CategorySchema } from 'src/database/schema/category.schema';

const ExpenseModel = dynamoose.model<ExpenseEntity>('Expense', ExpenseSchema);
const UserModel = dynamoose.model<UserEntity>('Users', UserSchema);
const CategoryModel = dynamoose.model<CategoryEntity>(
  'Categories',
  CategorySchema,
);

@Injectable()
export class AnalyticsService {
  async getAnalyticsByUserId(userid: string) {
    try {
      const user = await UserModel.get(userid);
      if (!user) throw new Error('User ID not found');

      const expenses = await ExpenseModel.query('userid').eq(userid).exec();

      let totalSpent = 0;
      const categoryTotals: Record<string, number> = {};
      const dateTotals: Record<string, number> = {};
      const monthlyCategoryTotals: Record<string, Record<string, number>> = {};

      expenses.forEach((expense) => {
        const amount = expense.amount;
        const category = expense.category;
        const date = new Date(expense.date);

        const dateKey = date.toISOString().split('T')[0]; // e.g. 2025-05-04
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // e.g. 2025-05

        // Overall total
        totalSpent += amount;

        // Category totals
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;

        // Date totals
        dateTotals[dateKey] = (dateTotals[dateKey] || 0) + amount;

        // Monthly category-wise totals
        if (!monthlyCategoryTotals[monthKey]) {
          monthlyCategoryTotals[monthKey] = {};
        }
        monthlyCategoryTotals[monthKey][category] =
          (monthlyCategoryTotals[monthKey][category] || 0) + amount;
      });

      // Top & Least category
      const sortedCategories = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1],
      );
      const topCategory = sortedCategories[0] || ['N/A', 0];
      const leastCategory = sortedCategories[sortedCategories.length - 1] || [
        'N/A',
        0,
      ];

      // Average daily expense
      const uniqueDates = Object.keys(dateTotals).length;
      const averageDailyExpense =
        uniqueDates > 0 ? totalSpent / uniqueDates : 0;

      return {
        totalSpent,
        topCategory: { category: topCategory[0], amount: topCategory[1] },
        leastCategory: { category: leastCategory[0], amount: leastCategory[1] },
        averageDailyExpense: Number(averageDailyExpense.toFixed(2)),
        dailyExpenses: Object.entries(dateTotals).map(([date, amount]) => ({
          date,
          amount,
        })),
        monthlyCategoryExpenses: monthlyCategoryTotals,
      };
    } catch (error) {
      console.error('Error while fetching analytics:', error);
      throw new Error('Error while fetching analytics');
    }
  }
}
