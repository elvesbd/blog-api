import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../infra/dto';
import { UserEntity } from '../infra/entity';
import { IUser } from '../infra/interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(user: CreateUserDto): Observable<IUser> {
    return from(this.userRepository.save(user));
  }

  findOne(id: number): Observable<IUser> {
    return from(this.userRepository.findOne(id));
  }

  findAll(): Observable<IUser[]> {
    return from(this.userRepository.find());
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: number, user: UpdateUserDto): Observable<any> {
    return from(this.userRepository.delete(id));
  }
}
