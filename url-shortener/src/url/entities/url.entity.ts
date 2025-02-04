import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/common/base.entity';

export type UrlDocument = HydratedDocument<Url>;
@Schema()
export class Url extends BaseEntity {
  @Prop()
  shortUrl: string;
  @Prop()
  longUrl: string;
  @Prop()
  expiryDate: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
