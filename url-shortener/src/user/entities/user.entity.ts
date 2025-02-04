import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/common/base.entity';
import { IUser } from 'src/common/interfaces/user.interface';

export type UserDocument = HydratedDocument<User>;
@Schema({ versionKey: false })
export class User extends BaseEntity implements IUser {
  @Prop({ type: String, required: true })
  fullName: string;
  @Prop({ type: String, required: true, unique: true })
  email: string;
  @Prop({ type: String, required: true, minlength: 6 })
  password?: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
