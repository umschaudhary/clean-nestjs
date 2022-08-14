import { IsEmail, IsString, IsNotEmpty, minLength, MinLength } from 'class-validator'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name?: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string
}

export class LoginDto {
  
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmpty()
  password: string
}

export class UserResponse {
  
  @ApiProperty()
  id: number
  
  @ApiProperty()
  name?: string
  
  @ApiProperty()
  email: string

  @Exclude()
  password: string

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial)
  }
}

export class Userpayload {
  @ApiProperty()
  name?: string
  
  @ApiProperty()
  email?: string
  
  @ApiProperty()
  isActive?: boolean
}
