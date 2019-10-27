import {IsNumber, IsString} from "class-validator";

export class PackDto {
    id?: number
    @IsString()
    name: string;
    @IsNumber()
    price: number
}