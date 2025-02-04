import { Prop, Schema } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema({ timestamps: true })
export class BaseEntity {
  @Prop({ type: String, default: uuidv4 })
  _id: string;
}
