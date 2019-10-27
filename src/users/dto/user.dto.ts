import {IsInt, IsOptional, IsString} from "class-validator";


export class UserDto {
    @IsString()
    public firstName: string;
    @IsString()
    public lastName: string;
    @IsString()
    public password: string;
    @IsString()
    public login: string;
}