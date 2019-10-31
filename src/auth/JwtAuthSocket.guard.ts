import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import config from "../config";
import {AuthService} from "./auth.service";
import {LoginDto} from "../users/dto/login.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtAuthSocketGuard implements CanActivate  {
    constructor(private readonly jwtService: JwtService) {
    }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToWs().getClient();
        let authToken = request.handshake.query.token;
        if(!authToken) return false;
        authToken = authToken.split(' ')[1];
        const verify = this.jwtService.verify<{login: string, sub: string}>(authToken);
        if(verify.login && verify.sub){
            request.authData = {
                id: verify.sub,
                login: verify.login
            }
            return request;
        }else return false;
    }
}