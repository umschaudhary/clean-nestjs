import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserRepository } from './users.repository'
import { JwtService } from '@nestjs/jwt'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,  
      secretOrPrivateKey: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UserRepository, JwtService],
})
export class UsersModule {}
