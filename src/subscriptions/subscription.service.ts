import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as dynamoose from 'dynamoose';
import { ExpenseEntity } from 'src/database/entity/expense.entity';
import { SubscriptionEntity } from 'src/database/entity/subscription.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { ExpenseSchema } from 'src/database/schema/expense.schema';
import { SubscriptionSchema } from 'src/database/schema/subscription.schema';
import { UserSchema } from 'src/database/schema/user.schema';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

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
  private readonly UserModel = dynamoose.model<UserEntity>(
    'Users',
    UserSchema,
  );

  @Cron('0 0 * * *', { timeZone: 'Asia/Kolkata' }) // every midnight
  async handleAutoExpenses() {
    const today = new Date().getDate();

    try {
      const subscriptions = await this.SubscriptionModel.scan().exec();

      const dueSubs = subscriptions.filter(
        (sub) => sub.autopay_date === today,
      );

      for (const sub of dueSubs) {
        await this.ExpenseModel.create({
          id: uuidv4(),
          userid: sub.user_id,
          amount: sub.amount,
          category: 'Subscriptions',
          note: `${sub.subscription} - Auto Expense`,
          date: new Date().toISOString(),
        });

        // Fetch user's expoPushToken
        const user = await this.UserModel.get(sub.user_id);
        if (user?.expoPushToken) {
          await this.sendPushNotification(
            user.expoPushToken,
            `₹${sub.amount} debited for ${sub.subscription}`,
            'Your subscription expense was added automatically.',
          );
        }

        this.logger.log(
          `Auto expense added for ${sub.subscription} (User: ${sub.user_id})`,
        );
      }

      this.logger.log(`Auto Addition of expenses done!`);
    } catch (err) {
      this.logger.error('Error in cron job:', err);
    }
  }

  @Cron('*/15 * * * *', { timeZone: 'Asia/Kolkata' }) // every 2 mins
  async testCron() {

    try {

      const userId = 'f1860de8-89ab-4990-9e57-d42aa8903a74';
      const user = await this.UserModel.get(userId);

        if (user?.expoPushToken) {
          await this.sendPushNotification(
            user.expoPushToken,
            `Test Notification`,
            'Test notification successful',
          );

        this.logger.log(
          `Test cron done`,
        );
      }

      this.logger.log(`Test Notification`);
    } catch (err) {
      this.logger.error('Error in cron job:', err);
    }
  }

  private async sendPushNotification(
    expoPushToken: string,
    title: string,
    body: string,
  ) {
    try {
      await axios.post('https://exp.host/--/api/v2/push/send', {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
      });
      this.logger.log(`Push notification sent to ${expoPushToken}`);
    } catch (err) {
      this.logger.error(`Failed to send push notification:`, err);
    }
  }
}
