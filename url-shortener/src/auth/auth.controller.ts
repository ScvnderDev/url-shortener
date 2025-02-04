import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

import {
  AuthDto,
  ChangePasswordDto,
  ForgetPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from './dto/create-auth.dto';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() createAuthDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(createAuthDto, response);
  }

  @Post('/refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
      response,
    );
  }

  @Post('/logout/')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Post('/forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto.email);
  }

  @Post('/reset-password')
  resetPassword(
    @Param('id') id: string,
    @Body('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: any,
    @Res({ passthrough: true }) response: any,
  ) {
    return this.authService.changePassword(
      request.auth.sub,
      changePasswordDto,
      response,
    );
  }
}
