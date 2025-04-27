import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import {ConfigModule} from '@nestjs/config';
import config from './config';
import { AnalyticsModule } from './analytics/analytics.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule,
    ExpenseModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
