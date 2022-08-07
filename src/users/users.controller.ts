import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findOne({ email: createUserDto.email })

    if (user) {
      throw new HttpException(
        'User with email already exists!',
        HttpStatus.BAD_REQUEST,
      )
    }

    return await this.usersService.create(createUserDto)
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    const user = await this.usersService.findOne({ id: Number(id) })
    if (!user) {
      throw new HttpException("User with email doesn't exists!", HttpStatus.NOT_FOUND)
    }
    return user
  }
}
