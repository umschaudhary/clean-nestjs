import { Injectable } from '@nestjs/common'
import { User, Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async findAll(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params
    return await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
  }

  async login(user: User): Promise<any> {
    const payload = {
      email: user.email,
      user_id: user.id,
    }

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    }
  }
}
