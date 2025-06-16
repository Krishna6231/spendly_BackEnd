import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { LendBorrowService } from './lendborrow.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';

@Controller('lend-borrow')
@UseGuards(JwtAuthGuard)
export class LendBorrowController {
  constructor(private readonly lendBorrowService: LendBorrowService) {}

  @Post('add')
  async addLendBorrow(
    @Body()
    body: {
      name: string;
      date: string;
      type: 'Lent' | 'Borrow';
      amount: number;
      installment?: { amount: number; date: string }[];
    },
    @Req() req,
  ) {
    return this.lendBorrowService.addLendBorrow(
      req.user.id,
      body.name,
      body.date,
      body.type,
      body.amount,
      body.installment || [],
    );
  }

  @Get()
  async getAllByUser(@Req() req) {
    return this.lendBorrowService.getLendBorrowByUser(req.user.id);
  }

  @Delete('delete')
  async delete(@Query('id') id: string, @Req() req) {
    return this.lendBorrowService.deleteLendBorrow(id, req.user.id);
  }

  @Patch('update/:id')
  async updateLendBorrow(
    @Param('id') id: string,
    @Req() req,
    @Body() updateData: any,
  ) {
    return this.lendBorrowService.updateLendBorrow(id, req.user.id, updateData);
  }
}
