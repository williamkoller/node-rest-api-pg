import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../../infra/db/repositories/user/user-repository';
import { IdentifyUserIdDTO } from '../../../presentation/dtos/user/identify-user-id.dto';

@Injectable()
export class DeleteUserUseCase {
  private notFoundException: NotFoundException = new NotFoundException(
    'User not found',
  );
  private logger = new Logger(DeleteUserUseCase.name);
  constructor(private readonly userRepository: UserRepository) {}

  async execute(identifyUserIdDTO: IdentifyUserIdDTO): Promise<void> {
    try {
      const user = await this.userRepository.findById(identifyUserIdDTO.id);
      if (!user) {
        throw this.notFoundException;
      }

      await this.userRepository.delete(user.id);
    } catch (error) {
      this.logger.error(error?.response?.message);
      if (error?.response?.statusCode === 404) {
        throw this.notFoundException;
      }

      throw new BadRequestException();
    }
  }
}
