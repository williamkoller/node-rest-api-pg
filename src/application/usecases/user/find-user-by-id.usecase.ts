import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../../infra/db/repositories/user/user-repository';
import { IdentifyUserIdDTO } from '../../../presentation/dtos/user/identify-user-id.dto';
import { UserModel } from '../../../infra/db/models/user/user.model';

@Injectable()
export class FindUserByIdUseCase {
  private notFoundException: NotFoundException = new NotFoundException(
    'User not found',
  );
  private logger = new Logger(FindUserByIdUseCase.name);
  constructor(private readonly userReposiory: UserRepository) {}

  async execute(identifyUserIdDTO: IdentifyUserIdDTO): Promise<UserModel> {
    try {
      const user = await this.userReposiory.findById(identifyUserIdDTO.id);
      if (!user) {
        throw this.notFoundException;
      }

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
