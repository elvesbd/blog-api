import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { IUser } from 'src/users/infra/interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: IUser): Observable<string> {
    return from(this.jwtService.signAsync(user));
  }

  hashPasswords(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  comparePasswords(
    newPassword: string,
    passwordHash: string,
  ): Observable<any | boolean> {
    return from(bcrypt.compare(newPassword, passwordHash));
  }
}
