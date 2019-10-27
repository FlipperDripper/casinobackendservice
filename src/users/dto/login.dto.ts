import {IsString} from "class-validator";


export class LoginDto {
    @IsString()
    public login: string;
    @IsString()
    public password: string;
}