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
import { CreateUserDto, LoginDto } from './dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const dbUser = await this.usersService.findOne({
      email: createUserDto.email,
    })

    if (dbUser) {
      throw new HttpException(
        'User with email already exists!',
        HttpStatus.BAD_REQUEST,
      )
    }

    const user = await this.usersService.create(createUserDto)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    const user = await this.usersService.findOne({ id: Number(id) })
    if (!user) {
      throw new HttpException(
        "User with email doesn't exists!",
        HttpStatus.NOT_FOUND,
      )
    }
    return user
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<User | null> {
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    )
    if (!user) {
      throw new HttpException('Invalid credential!', HttpStatus.BAD_REQUEST)
    }
    return this.usersService.login(user)
  }
}
