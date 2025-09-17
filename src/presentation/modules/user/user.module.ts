import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../../../infra/db/models/user/user.model';
import { UserRepository } from '../../../infra/db/repositories/user/user-repository';
import { AddUserUseCase } from '../../../application/usecases/user/add-user.usecase';
import { UserController } from '../../controllers/user/user.controller';
import { FindAllUsersUseCase } from '../../../application/usecases/user/find-all-user.usecase';
import { UpdateUserUseCase } from '../../../application/usecases/user/update-user.usecase';
import { DeleteUserUseCase } from '../../../application/usecases/user/delete-user.usecase';
import { FindUserByIdUseCase } from '../../../application/usecases/user/find-user-by-id.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [
    UserRepository,
    AddUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserByIdUseCase,
  ],
  controllers: [UserController],
})
export class UserModule {}
