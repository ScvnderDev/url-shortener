import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  fullName: string;

  @ApiProperty({
    example: 'securePass123',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
