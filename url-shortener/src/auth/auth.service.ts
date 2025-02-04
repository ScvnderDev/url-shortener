import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import {
  comparePassword,
  hashPassword,
} from 'src/common/helpers/password.helper';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './entities/refresh-token.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ResetToken } from './entities/reset-token.entity';
import { MailService } from 'src/common/mail.service';
import { ILogout } from 'src/common/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private readonly resetTokenModel: Model<ResetToken>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async generateToken(
    userId: string,
    response: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = { sub: userId };
      const accessToken = await this.jwtService.signAsync(payload); // return access token
      const refreshToken = uuidv4();
      await this.storeRefreshToken(userId, refreshToken); // store refresh token in db

      // Set cookie if response has a .cookie method

      response.cookie('accessToken', accessToken, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
      });
      response.cookie('refreshToken', refreshToken, {
        maxAge: 3600000 * 24 * 7, // 7 day
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async login(credentials: AuthDto, res: Response) {
    try {
      const { email, password } = credentials;
      const user = await this.userService.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException('Email you provided invalid');
      }

      const isMatch = await comparePassword(password, user.password!);

      if (user && !isMatch) {
        throw new UnauthorizedException('password incorrect');
      }

      const tokens = await this.generateToken(user._id, res); // access token

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    try {
      const refreshTokenStore = await new this.refreshTokenModel({
        userId,
        token: refreshToken,
        expiryDate: new Date(Date.now() + 3600000 * 24 * 7), // 7 days
      }).save();

      if (!refreshTokenStore) {
        throw new InternalServerErrorException(
          'Error in creating new refresh token',
        );
      }
      return refreshTokenStore.token;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async refreshToken(refreshToken: string, response: Response) {
    try {
      const token = await this.refreshTokenModel.findOne({
        where: { token: refreshToken, expiryDate: { $gte: new Date() } },
      });

      if (!token) {
        throw new Error('Invalid or expired token');
      }

      await this.refreshTokenModel.deleteOne({
        token: refreshToken,
      });

      return this.generateToken(token.id, response);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async logout(res: Response): Promise<ILogout> {
    try {
      res.cookie('token', '', {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'strict',
      });
      res.cookie('refreshToken', '', {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'strict',
      });
      return { message: 'Logout successful' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async changePassword(
    userId: string,
    changePasswordInput: ChangePasswordDto,
    res: Response,
  ) {
    const { oldPassword, newPassword } = changePasswordInput;
    const user = await this.userService.findOneById(userId);

    const isMatch = await comparePassword(oldPassword, user.password!);

    if (!isMatch) {
      throw new Error('Password mismatch');
    }
    const newPasswordHashed = hashPassword(newPassword);

    await this.userService.updatePassword(userId, newPasswordHashed);

    // auto logout after changing password
    const isLoggedOut = await this.logout(res);
    if (!isLoggedOut) {
      throw new Error('Error in logout after password change');
    }
    return { message: 'Password changed successfully' };
  }
  async forgetPassword(email: string) {
    try {
      const user = await this.userService.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const resetToken = uuidv4();
      const resetTokenCreate = await new this.resetTokenModel({
        token: resetToken,
        userId: user._id,
        expiryDate: new Date(new Date().getTime() + 60 * 60 * 1000),
      }).save();

      if (!resetTokenCreate) {
        throw new Error('Failed to save reset token');
      }

      await this.mailService.sendResetTokenToResetPassword(
        user.email,
        resetToken,
      );

      return { message: 'If your e-mail is valid you will receive an email' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { resetToken, password } = resetPasswordDto;
      const isResetToken = await this.resetTokenModel.findOne({
        token: resetToken,
        expiryDate: { $gte: new Date() },
      });

      if (!isResetToken) {
        throw new Error('Invalid or expired reset token');
      }
      const newPasswordHashed = hashPassword(password);
      await this.userService.updatePassword(
        isResetToken.userId,
        newPasswordHashed,
      );
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
