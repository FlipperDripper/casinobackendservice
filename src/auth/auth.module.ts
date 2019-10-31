import {Global, Module} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {PassportModule} from "@nestjs/passport";
import {UsersModule} from "../users/users.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import config from "../config";
import {AuthController} from "./auth.controller";
import {LocalAuthGuard} from "./localAuth.guard";
import {JwtAuthGuard} from "./jwtAuth.guard";
import {JwtAuthSocketGuard} from "./JwtAuthSocket.guard";

const JwtAuthModule = JwtModule.register({
    secret: config.jwtSecret,
    signOptions: { expiresIn: '7d' }
})
@Global()
@Module({
    imports: [
        UsersModule,
        PassportModule,
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: false
        }),
        JwtAuthModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalAuthGuard,
        JwtAuthGuard,
        JwtAuthSocketGuard

    ],
    exports: [AuthService, LocalAuthGuard, JwtAuthGuard, JwtAuthModule, JwtAuthSocketGuard]
})
export class AuthModule {
}
