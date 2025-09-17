import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
