import { Injectable } from '@nestjs/common';
import * as dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';
import { Item } from 'dynamoose/dist/Item';

import { LendBorrowEntity } from 'src/database/entity/lendBorrow.entity';
import { LendBorrowSchema } from 'src/database/schema/lendBorrow.schema';

export interface LendBorrowItem extends Item, LendBorrowEntity {}

const LendBorrowModel = dynamoose.model<LendBorrowItem>('LendBorrow', LendBorrowSchema);

@Injectable()
export class LendBorrowService {
  async addLendBorrow(
  user_id: string,
  name: string,
  date: string,
  type: 'Lent' | 'Borrow',
  amount: number,
  installment: { amount: number; date: string }[] = [],
) {
  try {
    const newEntry = await LendBorrowModel.create({
      id: uuidv4(),
      user_id,
      name,
      date,
      type,
      amount,
      installment,
    });

    return { ...newEntry };
  } catch (error) {
    console.error('Error while adding lend/borrow entry:', error);
    throw new Error('Failed to add lend/borrow entry');
  }
}


  async getLendBorrowByUser(user_id: string): Promise<LendBorrowEntity[]> {
    return await LendBorrowModel.query('user_id').eq(user_id).exec();
  }

  async deleteLendBorrow(id: string, user_id: string) {
    const record = await LendBorrowModel.get(id);
    if (!record || record.user_id !== user_id) {
      throw new Error('Unauthorized or record not found');
    }

    await LendBorrowModel.delete(id);
    return { message: 'Entry deleted successfully' };
  }

  async updateLendBorrow(
  id: string,
  user_id: string,
  updateData: Partial<LendBorrowEntity>,
): Promise<LendBorrowEntity> {
  const record = await LendBorrowModel.get(id);

  if (!record || record.user_id !== user_id) {
    throw new Error('Unauthorized or record not found');
  }

  Object.assign(record, updateData);
  await record.save();

  return record;
}

}
