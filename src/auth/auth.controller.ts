import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './reset-password.dto';
import * as dynamoose from 'dynamoose';
import { UserEntity } from 'src/database/entity/user.entity';
import { UserSchema } from 'src/database/schema/user.schema';

@Controller('auth')
export class AuthController {
  private readonly UserModel = dynamoose.model<UserEntity>('Users', UserSchema);
  constructor(
    private readonly authService: AuthService,
  ) {}

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

  @Post('refresh-token')
  async refresh(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    return this.authService.refreshToken(body.refreshToken);
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

  @Post('forgot-password')
async forgotPassword(@Body('email') email: string) {
  return this.authService.sendPasswordResetLink(email);
}

@Post('reset-password')
async resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto);
}


  @Post('/push-token')
async savePushToken(@Body() body: { userid: string; expoPushToken: string }) {
  await this.UserModel.update(
    { id: body.userid },
    { expoPushToken: body.expoPushToken },
  );
  return { message: 'Token saved' };
}
  @Post('logout')
  async logout(@Body() body: { refreshToken: string, userid: string }) {
    return this.authService.logout(body.refreshToken, body.userid);
  }
}
