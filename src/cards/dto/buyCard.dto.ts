import {IsInt} from "class-validator";

export class BuyCardDto {
    @IsInt()
    packId: number
}