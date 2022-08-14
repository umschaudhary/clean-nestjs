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
import { CreateUserDto, LoginDto, Userpayload, UserResponse } from './dto'
import { MailServiceAsync } from 'src/mail/mail.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly mailservice: MailServiceAsync,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const dbUser = await this.userService.findOne({
      email: createUserDto.email.toLowerCase(),
    })

    if (dbUser) {
      throw new HttpException(
        'User with email already exists!',
        HttpStatus.BAD_REQUEST,
      )
    }

    const user = await this.userService.create(createUserDto)
    await this.mailservice.sendConfirmationEmail(user)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    const user = await this.userService.findOne({ id: Number(id) })
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
    const user = await this.userService.findOne({ email: loginDto.email })
    if (!user) {
      throw new HttpException("User doesn't exists!", HttpStatus.BAD_REQUEST)
    }
    if (user && !user.isActive) {
      throw new HttpException(
        'User is inactive, Please activate your account first!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }
    const isValid = await this.userService.validateUser(loginDto, user)
    if (!isValid) {
      throw new HttpException('Invalid credential!', HttpStatus.BAD_REQUEST)
    }
    return this.userService.login(user)
  }

  @HttpCode(HttpStatus.OK)
  @Post('reconfirmation')
  async resendConfirmation(@Body() userPayload: Userpayload): Promise<any> {
    const user = await this.userService.findOne(userPayload)
    console.log("user", user)
    console.log("payload", userPayload)
    if (!user) {
      throw new HttpException("User doesn't exists!", HttpStatus.BAD_REQUEST)
    }
    if (user.isActive) {
      throw new HttpException('User is alreay active', HttpStatus.BAD_REQUEST)
    }
    await this.mailservice.sendConfirmationEmail(user)
    return {
      statusCode: HttpStatus.OK,
      message: 'Confirmation email has been sent!',
    }
  }

  // post confirmation
  @Get('/confirmation/:email')
  async postConfirm(@Param('email') email: string): Promise<any> {
    const update = {
      isActive: true,
    }
    const user = await this.userService.findOne({ email: email })

    if (user && user.isActive) {
      throw new HttpException('User is alreay active', HttpStatus.BAD_REQUEST)
    }
    if (!user) {
      throw new HttpException("User doesn't exists!", HttpStatus.BAD_REQUEST)
    }

    const userResponse = new UserResponse({
      ...user,
    })

    await this.userService.update(user, update)
    await this.mailservice.sendWelcomeEmail(userResponse)
    const result = {
      statusCode: 200,
      message: 'Account activated successfully!',
    }
    return result
  }
}
