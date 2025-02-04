import { Module } from '@nestjs/common';

import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('URL_DB'),
      }),
    }),
    AuthModule,
    UserModule,
    UrlModule,
  ],
})
export class AppModule {}
