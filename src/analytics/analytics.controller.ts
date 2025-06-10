import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly expenseService: AnalyticsService) {}

  @Get('user')
  async getAnalyticsByUserId(@Req() req) {
    const userId = req.user.id; 
    return this.expenseService.getAnalyticsByUserId(userId);
  }
  
}
