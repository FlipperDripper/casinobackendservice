import {BalanceOperationType} from "../balanceOperaton.entity";
import {IsEnum, IsInt} from "class-validator";


export class OperationDto {
    @IsInt()
    public value: number;
    @IsInt()
    public userId: number
    public type?: BalanceOperationType;
}
