import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Repository, Transaction, TransactionRepository} from "typeorm";
import {BalanceOperation, BalanceOperationType} from "./balanceOperaton.entity";
import {UsersService} from "../users/users.service";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "../users/user.repository";
import {FinanceRepository} from "./finance.repository";

@Injectable()
export class FinanceService {
    constructor(
        @InjectRepository(BalanceOperation)
        private readonly operationRepository: Repository<BalanceOperation>,
    ) {
    }

    @Transaction()
    async deposit(userId: number, value: number,
                  @TransactionRepository(UserRepository) userRep?: UserRepository,
                  @TransactionRepository(FinanceRepository) financeRep?: FinanceRepository): Promise<BalanceOperation> {

        const user = await userRep.findById(userId)
        if (!user) throw new HttpException("User with same id not found", HttpStatus.BAD_REQUEST);
        const currentBalance = Number(user.balance) + Number(value);
        await userRep.changeBalance(userId, currentBalance);
        const operation = await financeRep.createOperation(
            {value, type: BalanceOperationType.deposit, userId}, user
        );
        operation.user.balance = currentBalance;
        delete operation.user.password;
        return operation;

    }

    @Transaction()
    async withdraw(userId: number, value: number,
             @TransactionRepository(UserRepository) userRep?: UserRepository,
             @TransactionRepository(FinanceRepository) financeRep?: FinanceRepository): Promise<BalanceOperation>{

        const user = await userRep.findById(userId);
        if (!user) throw new HttpException("User with same id not found", HttpStatus.BAD_REQUEST);
        const currentBalance = Number(user.balance) - Number(value);
        if(currentBalance < 0) throw new HttpException("Not enough funds", HttpStatus.BAD_REQUEST);
        await userRep.changeBalance(userId, currentBalance);
        const operation =  await financeRep.createOperation({value, type: BalanceOperationType.withdraw, userId}, user)
        operation.user.balance = currentBalance;
        delete operation.user.password;
        return operation;
    }
}