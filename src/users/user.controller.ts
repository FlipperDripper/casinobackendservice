import {
    Body, ClassSerializerInterceptor,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {UsersService} from "./users.service";
import {User} from "./users.entity";
import {JwtAuthGuard} from "../auth/jwtAuth.guard";
import {UserDto} from "./dto/user.dto";

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController{
    private readonly usersService: UsersService
    constructor(usersService: UsersService){
        this.usersService = usersService;
    }
    @Get()
    async getAll():Promise<UserDto[]>{
        return (await this.usersService.findAll()).map(user=>{
            delete user.password;
            return user;
        });
    }
    @Get('/:id')
    async getOne(@Param('id') id): Promise<User>{
        const numId = Number(id);
        if(isNaN(numId)) throw new HttpException('Id must be a number', HttpStatus.BAD_REQUEST);
        const user = await this.usersService.findById(numId)
        if(!user) throw new HttpException("User with same id not found", HttpStatus.NOT_FOUND);
        return user;
    }
    @Get('/find/:login')
    async getByLogin(@Param('login') login: string):Promise<User>{
        const user = await this.usersService.findOne(login);
        if(!user) throw new HttpException("User with same login not found", HttpStatus.NOT_FOUND);
        return user;
    }
}