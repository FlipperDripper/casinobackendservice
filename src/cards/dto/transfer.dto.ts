import {IsInt} from "class-validator";

export class TransferDto {
    @IsInt()
    userId: number;
    @IsInt()
    cardId: number;
}