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

const randomMessages = [
  { title: 'Hey there! 👋', body: 'Are you spending anything today? 💰' },
  { title: 'Quick check-in! 📝', body: 'Keep your expenses in check ✍️' },
  { title: 'Track it now! ⏱️', body: 'Log your expenses before you forget. 🧾' },
  { title: '💸 Friendly reminder', body: 'Watch your spending today! 🔍' },
  { title: 'Stay on budget 📊', body: 'Try not to overspend today. 🚫' },
  { title: '“Every rupee saved is a rupee earned.” 💡', body: 'Be mindful of your expenses today! 🙌' },
  { title: '“Small leaks sink great ships.” 🚢', body: 'Don’t let small spends go unnoticed! 🧐' },
];


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
  private readonly UserModel = dynamoose.model<UserEntity>('Users', UserSchema);

  @Cron('30 2 * * *', { timeZone: 'UTC' }) // 2:30 UTC === 08:00 IST (+5hrs30mins)
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

  @Cron('*/30 * * * *', { timeZone: 'Asia/Kolkata' }) // every half an hour
  async sendRandomNotification() {
    // 50% chance to proceed
    if (Math.random() > 0.5) {
      this.logger.log('Skipped random notification.');
      return;
    }

    const users = await this.UserModel.scan().exec();

    // Filter users who have expoPushToken
    const eligibleUsers = users.filter((user) => !!user.expoPushToken);

    if (eligibleUsers.length === 0) return;

    const randomUser =
      eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];

    const randomMsg =
      randomMessages[Math.floor(Math.random() * randomMessages.length)];

    await this.sendPushNotification(
      randomUser.expoPushToken,
      randomMsg.title,
      randomMsg.body,
    );

    this.logger.log(`Sent random notification to ${randomUser.id}`);
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
