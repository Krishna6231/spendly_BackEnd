import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as dynamoose from 'dynamoose';
import { UserEntity } from 'src/database/entity/user.entity';
import { UserSchema } from 'src/database/schema/user.schema';
import { JwtAuthGuard } from './jwt-auth.gaurd';

@Controller('auth')
export class AuthController {
  private readonly UserModel = dynamoose.model<UserEntity>('Users', UserSchema);
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: { email: string; password: string; name: string },
  ) {
    return this.authService.signup(body.email, body.password, body.name);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() body: { oldPassword: string; newPassword: string },
    @Req() req,
  ) {
    return this.authService.changePassword(
      req.user.id,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.sendPasswordResetLink(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; token: string; newPassword: string },
  ) {
    return this.authService.resetPassword(
      body.email,
      body.token,
      body.newPassword,
    );
  }

  @Post('/push-token')
  async savePushToken(@Body() body: { userid: string; expoPushToken: string }) {
    await this.UserModel.update(
      { id: body.userid },
      { expoPushToken: body.expoPushToken },
    );
    return { message: 'Token saved' };
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Body() body: { refreshToken: string }) {
    const userId = req.user.id;
    return this.authService.logout(body.refreshToken, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update')
  async updateProfile(@Req() req, @Body() body: { name: string }) {
    const id = req.user.id;
    return this.authService.updateProfile(id, body.name);
  }
}
