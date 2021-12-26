import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/auth/services';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../infra/dto';
import { UserEntity } from '../infra/entity';
import { IUser } from '../infra/interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  create(user: CreateUserDto): Observable<IUser> {
    return this.authService.hashPasswords(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = passwordHash;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: IUser) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => throwError(() => new Error(err))),
        );
      }),
    );
  }

  findOne(id: number): Observable<IUser> {
    return from(this.userRepository.findOne(id)).pipe(
      map((user: IUser) => {
        const { password, ...result } = user;

        return result;
      }),
    );
  }

  findAll(): Observable<IUser[]> {
    return from(this.userRepository.find()).pipe(
      map((users: IUser[]) => {
        users.forEach(function (v) {
          delete v.password;
        });
        return users;
      }),
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: number, user: UpdateUserDto): Observable<any> {
    delete user.email;
    delete user.password;

    return from(this.userRepository.update(id, user));
  }

  login(user: IUser): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: IUser) => {
        if (user) {
          return this.authService
            .generateJWT(user)
            .pipe(map((jwt: string) => jwt));
        } else {
          return 'Wrong Credentials';
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<IUser> {
    return this.findByEmail(email).pipe(
      switchMap((user: IUser) =>
        this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }

  findByEmail(email: string): Observable<IUser> {
    return from(this.userRepository.findOne({ email }));
  }
}
