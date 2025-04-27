import { Controller, Post, Get, Query, Body, Put, Delete } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly expenseService: AnalyticsService) {}

  @Get('user')
  async getAnalyticsByUserId(@Query('userid') userid: string) {
    return this.expenseService.getAnalyticsByUserId(userid);
  }
  
}
