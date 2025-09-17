import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../infra/db/repositories/user/user-repository';
import { UserModel } from '../../../infra/db/models/user/user.model';

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserModel[]> {
    return await this.userRepository.findAll();
  }
}
