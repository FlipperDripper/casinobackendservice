import {EntityRepository, Repository} from "typeorm";
import {BalanceOperation, BalanceOperationType} from "./balanceOperaton.entity";
import {OperationDto} from "./dto/operation.dto";
import {User} from "../users/users.entity";
import {HttpException, HttpStatus} from "@nestjs/common";
import {UserRepository} from "../users/user.repository";

@EntityRepository(BalanceOperation)
export class FinanceRepository extends Repository<BalanceOperation>{
    async createOperation(operationDto: OperationDto, user: User){
        const operation = this.create({
            value: operationDto.value,
            type: operationDto.type
        });
        operation.user = user;
        return await this.save(operation);
    }
    async deposit(userId: number, value: number, userRep: UserRepository){
        const user = await userRep.findById(userId)
        if (!user) throw new HttpException("User with same id not found", HttpStatus.BAD_REQUEST);
        const currentBalance = Number(user.balance) + Number(value);
        await userRep.changeBalance(user.id, currentBalance);
        const operation = await this.createOperation(
            {value, type: BalanceOperationType.deposit, userId}, user
        );
        operation.user.balance = currentBalance;
        delete operation.user.password;
        return operation;
    }
    async withdraw(userId: number, value: number, userRep: UserRepository){
        const user = await userRep.findById(userId);
        if (!user) throw new HttpException("User with same id not found", HttpStatus.BAD_REQUEST);
        const currentBalance = Number(user.balance) - Number(value);
        if(currentBalance < 0) throw new HttpException("Not enough funds", HttpStatus.BAD_REQUEST);
        await userRep.changeBalance(userId, currentBalance);
        const operation =  await this.createOperation({value, type: BalanceOperationType.withdraw, userId}, user)
        operation.user.balance = currentBalance;
        delete operation.user.password;
        return operation;
    }
}