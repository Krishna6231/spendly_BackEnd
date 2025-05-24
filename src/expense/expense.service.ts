import { Injectable } from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { ExpenseEntity } from '../database/entity/expense.entity';
import { ExpenseSchema } from '../database/schema/expense.schema';
import { v4 as uuidv4 } from 'uuid';
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
export class ExpenseService {
  async addExpense(data: any): Promise<ExpenseEntity> {
    const user = await UserModel.get(data.id);
    if (!user) {
      throw new Error('User ID not found');
    }
    const expense = new ExpenseModel({
      id: uuidv4(),
      userid: data.id,
      category: data.category,
      amount: data.amount,
      date: data.date,
      note: data.note,
    });

    return (await expense.save()) as ExpenseEntity;
  }

  async getExpensesByUserId(userid: string): Promise<any> {
    const expenses = await ExpenseModel.scan({ userid }).exec();

    const categoryItems = await CategoryModel.scan({ user_id: userid }).exec();

    const categories = categoryItems.map((item) => ({
      category: item.category,
      limit: item.limit,
      color: item.color,
    }));

    return { expenses, categories };
  }

  async addCategory(
    user_id: string,
    category: string,
    limit: number,
    color: string,
  ) {
    try {
      const newCategory = await CategoryModel.create({
        user_id,
        category,
        limit,
        color,
      });

      return { ...newCategory };
    } catch (error) {
      console.error('Error while adding category:', error);
      throw new Error('Error while adding category');
    }
  }

  async deleteCategory(user_id: string, category: string) {
    try {
      // Find the category by scanning
      const result = await CategoryModel.scan({
        user_id: { eq: user_id },
        category: { eq: category },
      }).exec();

      if (result.count === 0) {
        throw new Error('Category not found.');
      }

      const categoryItem = result[0];
      await CategoryModel.delete(categoryItem.id);

      return { message: 'Category deleted successfully.', category };
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category.');
    }
  }

  async editCategoryLimit(
    user_id: string,
    category: string,
    limit: number,
    color: string,
  ) {
    try {
      const user = await UserModel.scan({ id: user_id }).exec();
      if (!user || user.length === 0) {
        throw new Error('User not found');
      }

      const categoryItem = await CategoryModel.scan({
        user_id,
        category,
      }).exec();

      if (!categoryItem || categoryItem.length === 0) {
        throw new Error('Category not found for this user');
      }

      const updated = await CategoryModel.update(
        { id: categoryItem[0].id },
        { limit, color },
      );

      return { ...updated };
    } catch (error) {
      console.error('Error while editing category limit:', error);
      throw new Error('Error while editing category limit');
    }
  }

  async deleteExpense(expenseId: string, userId: string) {
    try {
      const expense = await ExpenseModel.get(expenseId);

      if (!expense) {
        throw new Error('Expense not found');
      }

      if (expense.userid !== userId) {
        throw new Error(
          'Unauthorized: This expense does not belong to the user',
        );
      }

      await ExpenseModel.delete(expenseId);
      return { message: 'Expense deleted successfully' };
    } catch (error) {
      console.error('Error while deleting expense:', error);
      throw new Error('Error while deleting expense');
    }
  }
}
