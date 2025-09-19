import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserRepository } from '../../../infra/db/repositories/user/user-repository';
import { AddUserDTO } from '../../../presentation/dtos/user/add-user.dto';
import { UserModel } from '../../../infra/db/models/user/user.model';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class AddUserUseCase {
  private ConflictException: ConflictException = new ConflictException(
    'User already exists',
  );
  private logger = new Logger(AddUserUseCase.name);
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: AddUserDTO): Promise<UserModel> {
    try {
      const userExists = await this.userRepository.findByEmail(data.email);
      if (userExists && userExists.id) {
        throw this.ConflictException;
      }

      return await this.userRepository.create(data);
    } catch (error) {
      this.logger.error(error?.response?.message);
      if (
        (error instanceof QueryFailedError &&
          (error as any).code === '23505') ||
        error?.response?.statusCode === 409
      ) {
        throw this.ConflictException;
      }

      throw new BadRequestException('Error in created user');
    }
  }
}
