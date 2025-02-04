import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/common/base.entity';
import { IToken } from 'src/common/interfaces/auth.interface';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken extends BaseEntity implements IToken {
  @Prop({ type: String, required: true })
  token: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: Date, required: true })
  expiryDate: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
