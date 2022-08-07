import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserRepository } from './users.repository'
import { User } from '@prisma/client'
import { hashPassword } from './utils/password'

@Injectable()
export class UsersService {
  constructor(private repo: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await hashPassword(createUserDto.password)
    return this.repo.create({
      ...createUserDto,
      password: hash,
    })
  }

  findAll(): Promise<User[]> {
    return this.repo.findAll({})
  }

  findOne(filter: any): Promise<User | null> {
    return this.repo.findOne(filter)
  }
}
