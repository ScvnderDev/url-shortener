import { Module } from '@nestjs/common';

import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
   

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: "mongodb+srv://benjemianezih:fixtronix@fixtronixdatabase.1xkjlbq.mongodb.net/",
      }),
    }),
    AuthModule,
    UserModule,
    UrlModule,
  ],
  controllers:[AppController]
})
export class AppModule {}
