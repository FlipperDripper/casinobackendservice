import {Body, Controller, Get, Param, Post, UsePipes, ValidationPipe} from "@nestjs/common";
import {UsersService} from "./users.service";
import {User} from "./users.entity";
import {UserDto} from "./dto/user.dto";
import {SignUpValidator} from "../validators/SignUp";

@Controller('users')
export class UsersController{
    private readonly usersService: UsersService
    constructor(usersService: UsersService){
        this.usersService = usersService;
    }
    @Get()
    async findAll():Promise<User[]>{
        return await this.usersService.findAll();
    }
    @Post('sing-up')
    @UsePipes(SignUpValidator, ValidationPipe)
    async createUser(@Body() userDto: UserDto){
        return this.usersService.createUser(userDto);
    }
}