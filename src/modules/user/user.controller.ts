import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { User } from '@/modules/user/entities/user.entity';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { DeleteUserResponse } from '@/modules/user/types/delete-user.type';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/user/enums/roles.enum';
import { GetUserReqDto } from '@/modules/user/dto/get-user.dto';
import { SafeUser } from '@/modules/auth/types/register.type';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Get()
  find(@Query() query: GetUserReqDto): Promise<User[]> {
    return this.userService.find(query);
  }

  @Post()
  @Permissions(Roles.ADMIN)
  create(@Body() payload: CreateUserDto): Promise<SafeUser> {
    return this.userService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<SafeUser | null> {
    return this.userService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteUserResponse> {
    return this.userService.delete(id);
  }
}
