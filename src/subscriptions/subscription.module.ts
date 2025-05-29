import { Module } from '@nestjs/common';
import { SubscriptionCronService } from './subscription.service';

@Module({
  providers: [SubscriptionCronService],
  exports: [],
})
export class SubscriptionsModule {}
