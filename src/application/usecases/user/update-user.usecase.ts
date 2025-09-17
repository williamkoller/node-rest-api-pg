import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../../infra/db/repositories/user/user-repository';
import { UpdateUserDTO } from '../../../presentation/dtos/user/update-user.dto';
import { UpdateResult } from 'typeorm';
import { UserModel } from '../../../infra/db/models/user/user.model';
import { IdentifyUserIdDTO } from '../../../presentation/dtos/user/identify-user-id.dto';

@Injectable()
export class UpdateUserUseCase {
  private notFoundException: NotFoundException = new NotFoundException(
    'User not found',
  );
  private logger = new Logger(UpdateUserUseCase.name);
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    identifyUserIdDTO: IdentifyUserIdDTO,
    data: UpdateUserDTO,
  ): Promise<UserModel> {
    try {
      const user = await this.userRepository.findById(identifyUserIdDTO.id);
      if (!user) {
        throw this.notFoundException;
      }

      await this.userRepository.update(user.id, data);

      return user;
    } catch (error) {
      this.logger.error(error.response.message);
      if (error.response.statusCode === 404) {
        throw this.notFoundException;
      }

      throw new BadRequestException();
    }
  }
}
