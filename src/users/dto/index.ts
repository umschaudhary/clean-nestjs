import {
  IsEmail,
  Length,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsDate,
} from 'class-validator';

export class CreateUserDto {
  name?: string
  email: string
  password: string
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @IsNotEmpty()
  password: string
}
