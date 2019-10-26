import { Module } from '@nestjs/common';
import {UsersController} from "./user.controller";
import {UsersService} from "./users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {APP_PIPE} from "@nestjs/core";
import {SignUpValidator} from "../validators/SignUp";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, {
        provide: APP_PIPE,
        useClass: SignUpValidator
    }],
    exports: [UsersService]
})
export class UsersModule {}
