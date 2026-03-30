import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/entities/user.entity';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { DeleteUserResponse } from '@/modules/user/types/delete-user.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-by-id/:id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Get('get-by-email/:email')
  findByEmail(@Param('email', ParseIntPipe) email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }

  @Post()
  create(@Body() payload: CreateUserDto): Promise<User> {
    return this.userService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteUserResponse> {
    return this.userService.delete(id);
  }
}
