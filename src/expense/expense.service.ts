import { Injectable } from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { ExpenseEntity } from '../database/entity/expense.entity';
import { ExpenseSchema } from '../database/schema/expense.schema';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from 'src/database/entity/user.entity';
import { UserSchema } from 'src/database/schema/user.schema';

const ExpenseModel = dynamoose.model<ExpenseEntity>('Expense', ExpenseSchema);
const UserModel = dynamoose.model<UserEntity>('Users',UserSchema);
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
      amount: data.amount || '',
      date: data.date || '',
    });

    return await expense.save() as ExpenseEntity;
  }
}
