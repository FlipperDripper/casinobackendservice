import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {JwtService} from "@nestjs/jwt";
import {User} from "../users/users.entity";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(login: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(login);
        if (user && await AuthService.comparePasswords(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user: User) {
        const payload = { login: user.login, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    private static async comparePasswords(plainPassword: string, hashedPassword): Promise<boolean>{
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}