import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The long URL that needs to be shortened',
    example: 'https://example.com',
  })
  @IsUrl()
  longUrl: string;
}
