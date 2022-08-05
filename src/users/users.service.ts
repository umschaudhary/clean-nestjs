import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, 
  ){}

  create(createUserDto: CreateUserDto) {
    const user = CreateUserDto()
    return this.userRepository.create(createUserDto)
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number):Promise<User> {
    return this.userRepository.findOneBy({id})
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
