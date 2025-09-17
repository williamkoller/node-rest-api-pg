import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddUserUseCase } from '../../../application/usecases/user/add-user.usecase';
import { FindAllUsersUseCase } from '../../../application/usecases/user/find-all-user.usecase';
import { UpdateUserUseCase } from '../../../application/usecases/user/update-user.usecase';
import { UserModel } from '../../../infra/db/models/user/user.model';
import { AddUserDTO } from '../../dtos/user/add-user.dto';
import { IdentifyUserIdDTO } from '../../dtos/user/identify-user-id.dto';
import { UpdateUserDTO } from '../../dtos/user/update-user.dto';
import { DeleteUserUseCase } from '../../../application/usecases/user/delete-user.usecase';
import { FindUserByIdUseCase } from '../../../application/usecases/user/find-user-by-id.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly addUserUseCase: AddUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: AddUserDTO): Promise<UserModel> {
    return await this.addUserUseCase.execute(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserModel[]> {
    return await this.findAllUsersUseCase.execute();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async edit(
    @Param() identifyUserIdDTO: IdentifyUserIdDTO,
    @Body() data: UpdateUserDTO,
  ): Promise<UserModel> {
    return await this.updateUserUseCase.execute(identifyUserIdDTO, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() identifyUserIdDTO: IdentifyUserIdDTO): Promise<void> {
    await this.deleteUserUseCase.execute(identifyUserIdDTO);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param() identifyUserIdDTO: IdentifyUserIdDTO,
  ): Promise<UserModel> {
    return await this.findUserByIdUseCase.execute(identifyUserIdDTO);
  }
}
