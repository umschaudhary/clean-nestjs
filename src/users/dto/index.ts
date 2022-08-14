import { IsEmail, IsString, IsNotEmpty } from 'class-validator'
import { Exclude } from 'class-transformer'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name?: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
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

export class UserResponse {
  id: number
  name?: string
  email: string

  @Exclude()
  password: string

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial)
  }
}
