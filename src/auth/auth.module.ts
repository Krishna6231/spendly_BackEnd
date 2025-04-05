import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config';
@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT_SECRET', // ideally store this in .env
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot({
        isGlobal: true,
        load: [config]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule], // 👈 This allows other modules to use JwtModule
})
export class AuthModule {}
