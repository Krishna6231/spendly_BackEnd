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
          if (!user) {
            throw new Error('User ID not found');
          }
      
          const expenses = await ExpenseModel.scan({ userid }).exec();
      
          // Helper function to format dates
          const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
          // Initialize analytics
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const thisMonthExpenses: { label: string; value: number }[] = [];
          const allMonthsExpenses: { label: string; value: number }[] = [];
          const weeklyExpenses: { label: string; value: number }[] = [];
          const categoryTotals: Record<string, number> = {};
          const dateTotals: Record<string, number> = {};
      
          // Group expenses
          expenses.forEach((expense) => {
            const expenseDate = new Date(expense.date);
            const year = expenseDate.getFullYear();
            const month = expenseDate.getMonth();
            const day = expenseDate.getDate();
            const weekDay = expenseDate.toLocaleDateString('en-US', { weekday: 'short' });
      
            // This month graph
            if (year === currentYear && month === currentMonth) {
              const existing = thisMonthExpenses.find(e => e.label === day.toString());
              if (existing) {
                existing.value += expense.amount;
              } else {
                thisMonthExpenses.push({ label: day.toString(), value: expense.amount });
              }
            }
      
            // All months graph
            const monthLabel = expenseDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const existingMonth = allMonthsExpenses.find(e => e.label === monthLabel);
            if (existingMonth) {
              existingMonth.value += expense.amount;
            } else {
              allMonthsExpenses.push({ label: monthLabel, value: expense.amount });
            }
      
            // Weekly graph (last 7 days)
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - expenseDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) {
              const existingDay = weeklyExpenses.find(e => e.label === weekDay);
              if (existingDay) {
                existingDay.value += expense.amount;
              } else {
                weeklyExpenses.push({ label: weekDay, value: expense.amount });
              }
            }
      
            // Category totals
            if (categoryTotals[expense.category]) {
              categoryTotals[expense.category] += expense.amount;
            } else {
              categoryTotals[expense.category] = expense.amount;
            }
      
            // Date totals (for highest spending date)
            const dateKey = formatDate(expenseDate);
            if (dateTotals[dateKey]) {
              dateTotals[dateKey] += expense.amount;
            } else {
              dateTotals[dateKey] = expense.amount;
            }
          });
      
          // Find high spending category
          const highSpendingCategory = Object.entries(categoryTotals).reduce((max, current) => {
            return current[1] > max[1] ? current : max;
          }, ["", 0]);
      
          // Find highest spending date
          const highSpendingDate = Object.entries(dateTotals).reduce((max, current) => {
            return current[1] > max[1] ? current : max;
          }, ["", 0]);
      
          // Optional: Sort graphs by label (like days/months order)
          thisMonthExpenses.sort((a, b) => Number(a.label) - Number(b.label));
          weeklyExpenses.sort((a, b) => a.label.localeCompare(b.label)); // Mon, Tue, etc.
          allMonthsExpenses.sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime());
      
          // Return everything
          return {
            currentMonthGraph: thisMonthExpenses,
            allMonthsGraph: allMonthsExpenses,
            weeklyGraph: weeklyExpenses,
            highSpendingCategory: { category: highSpendingCategory[0], amount: highSpendingCategory[1] },
            highSpendingDate: { date: highSpendingDate[0], amount: highSpendingDate[1] },
            totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
          };
        } catch (error) {
          console.error('Error while fetching analytics:', error);
          throw new Error('Error while fetching analytics');
        }
      }
      
}
