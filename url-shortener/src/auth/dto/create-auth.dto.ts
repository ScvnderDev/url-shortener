import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';
import {
  IChangePassword,
  ILogin,
  IRefreshToken,
  IResetPassword,
} from 'src/common/interfaces/auth.interface';

export class AuthDto implements ILogin {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class ChangePasswordDto implements IChangePassword {
  @ApiProperty({ example: 'oldPassword123', description: 'Old user password' })
  @IsString({ message: 'Old password must be a string' })
  oldPassword: string;
  @ApiProperty({ example: 'newPassword123', description: 'New user password' })
  @IsString({ message: 'Old password must be a string' })
  newPassword: string;
}

export class RefreshTokenDto implements IRefreshToken {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Refresh token',
  })
  @IsUUID('4', { message: 'Refresh token must be a valid UUID' })
  refreshToken: string;
}

export class ResetPasswordDto implements IResetPassword {
  @ApiProperty({
    example: 'newPassword123',
    description: 'New password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
  @ApiProperty({
    example: 'resetToken123',
    description: 'Reset token received via email',
  })
  @IsString()
  resetToken: string;
}

export class ForgetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;
}
