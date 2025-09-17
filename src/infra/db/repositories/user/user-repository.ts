import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../../models/user/user.model';
import { Repository, UpdateResult } from 'typeorm';
import { AddUserDTO } from '../../../../presentation/dtos/user/add-user.dto';
import { UpdateUserDTO } from '../../../../presentation/dtos/user/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
  ) {}

  async create(data: AddUserDTO): Promise<UserModel> {
    return await this.userRepo.save(data);
  }

  async findAll(): Promise<UserModel[]> {
    return await this.userRepo.find({ order: { id: 'ASC' } });
  }

  async findById(id: number): Promise<UserModel | null> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    return user;
  }

  async update(id: number, data: UpdateUserDTO): Promise<void> {
    await this.userRepo.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
