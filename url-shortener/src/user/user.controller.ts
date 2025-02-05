import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
@ApiTags('Users')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' }) // Describes the endpoint
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('/user-info')
  async getUserLoggedInInfo(@Req() request: any) {
    // const user = request.auth.sub;

    const user = await this.userService.findOneById(request.auth.sub);
    const { password, ...userInfo } = user;
    return userInfo;
  }
}
