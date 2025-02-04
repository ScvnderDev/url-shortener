import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createUrlDto: CreateUrlDto) {
    return await this.urlService.create(createUrlDto);
  }

  @Get(':shortId')
  @ApiOperation({ summary: 'Get the long URL by short URL ID' })
  @ApiResponse({ status: 302, description: 'Redirects to the long URL' })
  async findByShortId(
    @Param('shortId') shortId: string,
    @Res() response: Response,
  ) {
    return await this.urlService.getShortUrl(shortId, response);
  }
}
