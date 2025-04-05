import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import {ConfigModule} from '@nestjs/config';
import config from './config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule
  ],
})
export class AppModule {}
