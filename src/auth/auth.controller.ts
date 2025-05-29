import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
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

  @Post('change-password')
  async changePassword(
    @Body() body: { userId: string; oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      body.userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    return this.authService.logout(body.refreshToken);
  }
}
