import {IsInt} from "class-validator";

export class CardDto {
    id?:number
    @IsInt()
    packId: number
    @IsInt()
    itemId: number
    @IsInt()
    userId: number
}