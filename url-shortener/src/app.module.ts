import { Module } from '@nestjs/common';

import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      serveRoot: '/public',
      rootPath: join(__dirname, '..', 'public'),
   }),
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
})
export class AppModule {}
