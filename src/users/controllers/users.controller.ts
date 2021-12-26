import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { CreateUserDto, UpdateUserDto } from '../infra/dto';
import { IUser } from '../infra/interfaces';
import { UsersService } from '../services';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() user: CreateUserDto): Observable<IUser | any> {
    return this.userService.create(user).pipe(
      map((user: IUser) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  login(@Body() user: IUser): Observable<any> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return {
          access_token: jwt,
        };
      }),
    );
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
    @Body() user: UpdateUserDto,
  ): Observable<any> {
    return this.userService.updateOne(+id, user);
  }
}
