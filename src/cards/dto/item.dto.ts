import {IsInt, IsNumber, IsString} from "class-validator";

export class ItemDto {
    id?:number
    @IsString()
    name: string
    @IsNumber()
    value: number
    @IsInt()
    packId: number
}