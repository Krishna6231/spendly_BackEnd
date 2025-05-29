import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import {ConfigModule} from '@nestjs/config';
import config from './config';
import { AnalyticsModule } from './analytics/analytics.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionsModule } from './subscriptions/subscription.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule,
    ExpenseModule,
    AnalyticsModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
