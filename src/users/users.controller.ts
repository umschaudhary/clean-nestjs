import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { UsersService } from './users.service'
import { CreateUserDto, LoginDto } from './dto'
import { MailServiceAsync } from 'src/mail/mail.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailservice: MailServiceAsync,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const dbUser = await this.usersService.findOne({
      email: createUserDto.email.toLowerCase(),
    })

    if (dbUser) {
      throw new HttpException(
        'User with email already exists!',
        HttpStatus.BAD_REQUEST,
      )
    }

    const user = await this.usersService.create(createUserDto)
    await this.mailservice.sendConfirmationEmail(user)
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

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<User | null> {
    const user = await this.usersService.findOne({ email: loginDto.email })
    if (!user) {
      throw new HttpException("User doesn't exists!", HttpStatus.BAD_REQUEST)
    }
    const isValid = await this.usersService.validateUser(loginDto, user)
    if (!isValid) {
      throw new HttpException('Invalid credential!', HttpStatus.BAD_REQUEST)
    }
    return this.usersService.login(user)
  }
}
