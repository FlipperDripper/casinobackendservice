import {Body, Controller, Post, UseGuards, UsePipes, ValidationPipe} from "@nestjs/common";
import {SignUpValidator} from "../validators/SignUp";
import {LocalAuthGuard} from "./localAuth.guard";
import {LoginValidator} from "../validators/Login";
import {AuthService} from "./auth.service";
import {UserDto} from "../users/dto/user.dto";
import {UsersService} from "../users/users.service";
import {LoginDto} from "../users/dto/login.dto";

@Controller('auth')
export class AuthController{
    private readonly usersService: UsersService
    private readonly authService: AuthService
    constructor(usersService: UsersService, authService: AuthService){
        this.usersService = usersService;
        this.authService = authService;
    }

    @Post('sign-up')
    @UsePipes(SignUpValidator, ValidationPipe)
    async createUser(@Body() userDto: UserDto){
        return this.usersService.createUser(userDto);
    }

    @Post('sign-in')
    @UseGuards(LocalAuthGuard)
    async login(@Body() loginDto: LoginDto){
        const user = await this.usersService.findOne(loginDto.login);
        if(user) return await this.authService.login(user);
    }
}