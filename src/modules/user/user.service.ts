import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserErrors } from '@/modules/user/enums/errors.enum';
import type { DeleteUserResponse } from '@/modules/user/types/delete-user.type';
import type { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import type { UpdateUserDto } from '@/modules/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(payload: CreateUserDto): Promise<User> {
    const user: User = this.userRepository.create(payload);

    const created: User = await this.userRepository.save(user);

    if (!created) throw new BadRequestException(UserErrors.NOT_CREATED);

    return created;
  }

  async update(id: number, payload: UpdateUserDto): Promise<User | null> {
    await this.findById(id);

    const { affected } = await this.userRepository.update(id, payload);

    if (affected === 0) throw new BadRequestException(UserErrors.NOT_UPDATED);

    return await this.findById(id);
  }

  async delete(id: number): Promise<DeleteUserResponse> {
    await this.findById(id);

    const { affected } = await this.userRepository.delete(id);

    if (affected === 0) throw new BadRequestException(UserErrors.NOT_DELETED);

    return { success: true };
  }
}
