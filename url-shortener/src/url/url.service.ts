import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './entities/url.entity';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { Response } from 'express';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  private generateUrlId(): string {
    return nanoid(6);
  }
  async create(createUrlDto: CreateUrlDto) {
    const shortUrl = this.generateUrlId();
    try {
      const { longUrl } = createUrlDto;

      const url = await new this.urlModel({
        longUrl,
        shortUrl,
        expiryDate: new Date(new Date().getTime() + 60 * 60 * 1000),
      }).save();
      if (!url) throw new InternalServerErrorException('Error in creating url');
      return {
        shortUrl: `${process.env.BASE_URL || 'https://url-shortener-04ga.onrender.com'}/api/url/${url.shortUrl}`,
        expiryDate: url.expiryDate,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getShortUrl(shortUrlId: string, response: Response) {
    try {
      const url = await this.urlModel.findOne({
        shortUrl: shortUrlId,
        expiryDate: { $gte: new Date() },
      });

      if (!url) throw new NotFoundException('Url not found or url expired');
      return response.redirect(url.longUrl);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
