import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto'
import { UserRepository } from './users.repository'
import { User } from '@prisma/client'
import { hashPassword, verifyPassword } from './utils/password'

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

  async findAll(): Promise<User[]> {
    return this.repo.findAll({})
  }

  async findOne(filter: any): Promise<User | null> {
    return this.repo.findOne(filter)
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.repo.findOne({ email: email })
    const isValid = await verifyPassword(pass, user?.password)
    return isValid ? user : null
  }

  async login(user: User): Promise<any> {
    return this.repo.login(user)
  }
}
