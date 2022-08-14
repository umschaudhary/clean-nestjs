import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserRepository } from './users.repository'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './utils/jwt.strategy'
import { MailModule } from 'src/mail/mail.module'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1y' },
    }),
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UserRepository, JwtStrategy],
})
export class UsersModule {}
