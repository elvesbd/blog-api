import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto } from '../infra/dto';
import { IUser } from '../infra/interfaces';
import { UsersService } from '../services';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Observable<IUser> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param() params): Observable<IUser> {
    return this.userService.findOne(params.id);
  }

  @Get()
  findAll(): Observable<IUser[]> {
    return this.userService.findAll();
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<IUser> {
    return this.userService.deleteOne(+id);
  }

  @Put(':id')
  updateOne(
    @Param('id') id: string,
    updateUserDto: UpdateUserDto,
  ): Observable<any> {
    return this.userService.updateOne(+id, updateUserDto);
  }
}
