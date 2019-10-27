import { Module } from '@nestjs/common';
import {UsersController} from "./user.controller";
import {UsersService} from "./users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {LocalAuthGuard} from "../auth/localAuth.guard";
import {JwtAuthGuard} from "../auth/jwtAuth.guard";


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, LocalAuthGuard, JwtAuthGuard],
    exports: [UsersService]
})
export class UsersModule {}
