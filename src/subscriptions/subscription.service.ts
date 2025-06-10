import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as dynamoose from 'dynamoose';
import { ExpenseEntity } from 'src/database/entity/expense.entity';
import { SubscriptionEntity } from 'src/database/entity/subscription.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { ExpenseSchema } from 'src/database/schema/expense.schema';
import { SubscriptionSchema } from 'src/database/schema/subscription.schema';
import { UserSchema } from 'src/database/schema/user.schema';
import { CategorySchema } from 'src/database/schema/category.schema';
import { CategoryEntity } from 'src/database/entity/category.entity';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const randomMessages = [
  { title: 'Hey there! 👋', body: 'Are you spending anything today? 💰' },
  { title: 'Quick check-in! 📝', body: 'Keep your expenses in check ✍️' },
  {
    title: 'Track it now! ⏱️',
    body: 'Log your expenses before you forget. 🧾',
  },
  { title: '💸 Friendly reminder', body: 'Watch your spending today! 🔍' },
  { title: 'Stay on budget 📊', body: 'Try not to overspend today. 🚫' },
  {
    title: '“Every rupee saved is a rupee earned.” 💡',
    body: 'Be mindful of your expenses today! 🙌',
  },
  {
    title: '“Small leaks sink great ships.” 🚢',
    body: 'Don’t let small spends go unnoticed! 🧐',
  },
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
  private readonly CategoryModel = dynamoose.model<CategoryEntity>(
    'Categories',
    CategorySchema,
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
    } catch (err) {
      this.logger.error('Error in cron job:', err);
    }
  }

  @Cron('0 * * * *', { timeZone: 'Asia/Kolkata' }) // every hour
  async sendRandomNotification() {
    // 50% chance to proceed
    if (Math.random() > 0.5) {
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
  }

  @Cron('30 4 * * *', { timeZone: 'UTC' }) // 4:30 UTC === 10:00 IST (+5hrs30mins)
  async sendLimitWarning() {
    const users = await this.UserModel.scan().exec();
    const eligibleUsers = users.filter((user) => !!user.expoPushToken);
    const categories = await this.CategoryModel.scan().exec();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    for (const user of eligibleUsers) {
      const userExpenses = await this.ExpenseModel.query("userid").eq(user.id).exec();
    
      const monthlyExpenses = userExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfMonth && expenseDate <= now;
      });

      const spentByCategory: Record<string, number> = {};
      for (const exp of monthlyExpenses) {
        spentByCategory[exp.category] =
          (spentByCategory[exp.category] || 0) + exp.amount;
      }

      const userCategories = categories.filter(
        (cat) => cat.user_id === user.id,
      );

      const overLimitCategories: string[] = [];

      for (const cat of userCategories) {
        const spent = spentByCategory[cat.category] || 0;
        const limit = cat.limit || 0;

        if (limit > 0 && spent >= 0.8 * limit) {
          overLimitCategories.push(cat.category);
        }
      }

      if (overLimitCategories.length === 1) {
        const catName = overLimitCategories[0];
        const spent = spentByCategory[catName];
        const limit =
          userCategories.find((cat) => cat.category === catName)?.limit || 1;
        const title = `Hey ${user.name}`;
        const body = `You're already at ${Math.round((spent / limit) * 100)}% of your "${catName}" budget. Chill a bit or you'll be broke 😬`;

        await this.sendPushNotification(user.expoPushToken, title, body);
      } else if (overLimitCategories.length > 1) {
        const categoriesList = overLimitCategories.join(', ');
        const title = `Yo ${user.name}`;
        const body = `You’ve already crossed 80% in these categories: ${categoriesList}. Slow down or start a side hustle 😂`;

        await this.sendPushNotification(user.expoPushToken, title, body);
      }
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
    } catch (err) {
      this.logger.error(`Failed to send push notification:`, err);
    }
  }
}
