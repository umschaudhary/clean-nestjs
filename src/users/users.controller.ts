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
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly mailservice: MailServiceAsync,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Created!' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request!' })
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
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Ok!' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error!' })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Ok!' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error!' })
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
  @ApiOperation({ summary: 'Get Access Token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Ok!' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error!' })
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
  @ApiOperation({ summary: 'Send Reconfirmation Email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Ok!' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error!' })
  async resendConfirmation(@Body() userPayload: Userpayload): Promise<any> {
    const user = await this.userService.findOne(userPayload)
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
  @ApiOperation({ summary: 'Confirm User Registration' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Ok!' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error!' })
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
