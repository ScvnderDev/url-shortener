import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './entities/refresh-token.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from 'src/common/mail.service';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { ResetToken, ResetTokenSchema } from './entities/reset-token.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret',
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, MailService],
})
export class AuthModule {}
