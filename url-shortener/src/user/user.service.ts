import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/common/helpers/password.helper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('🍢[createUserDto]:', createUserDto);
    try {
      // Hash password before saving the user
      const hashedPassword = hashPassword(createUserDto.password);

      const newUser = await new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      }).save();
      if (!newUser)
        throw new InternalServerErrorException('Error while creating user');

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(_id: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ _id }).lean();
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  async updatePassword(_id: string, password: string) {
    try {
      const updatePassword = await this.userModel.findOneAndUpdate(
        { _id },
        { $set: { password } },
      );
      if (!updatePassword) {
        throw new InternalServerErrorException('Error while updating password');
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
