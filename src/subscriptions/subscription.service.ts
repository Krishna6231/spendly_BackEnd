import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as dynamoose from 'dynamoose';
import { ExpenseEntity } from 'src/database/entity/expense.entity';
import { SubscriptionEntity } from 'src/database/entity/subscription.entity';
import { ExpenseSchema } from 'src/database/schema/expense.schema';
import { SubscriptionSchema } from 'src/database/schema/subscription.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SubscriptionCronService {
  private readonly logger = new Logger(SubscriptionCronService.name);

  private readonly SubscriptionModel = dynamoose.model<SubscriptionEntity>(
    'Subscriptions',
    SubscriptionSchema,
  );
  private readonly ExpenseModel = dynamoose.model<ExpenseEntity>(
    'Expense',
    ExpenseSchema,
  );

  // @Cron('0 0 * * *', { timeZone: 'Asia/Kolkata' }) //every midnight
  @Cron('* * * * *', { timeZone: 'Asia/Kolkata' })
  async handleAutoExpenses() {
    const today = new Date().getDate();

    try {
      const subscriptions = await this.SubscriptionModel.scan().exec();

      const dueSubs = subscriptions.filter((sub) => sub.autopay_date === today);

      for (const sub of dueSubs) {
        await this.ExpenseModel.create({
          id: uuidv4(),
          userid: sub.user_id,
          amount: sub.amount,
          category: 'Subscriptions',
          note: `${sub.subscription} - Auto Expense`,
          date: new Date().toISOString(),
        });

        this.logger.log(
          `Auto expense added for ${sub.subscription} (User: ${sub.user_id})`,
        );
      }

      this.logger.log(`Auto Addition of expenses done!`);
    } catch (err) {
      this.logger.error('Error in cron job:', err);
    }
  }
}
