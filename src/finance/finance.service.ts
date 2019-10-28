import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Repository, Transaction, TransactionRepository} from "typeorm";
import {BalanceOperation, BalanceOperationType} from "./balanceOperaton.entity";
import {UsersService} from "../users/users.service";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "../users/user.repository";
import {FinanceRepository} from "./finance.repository";

@Injectable()
export class FinanceService {
    constructor() {}

    @Transaction()
    async deposit(userId: number, value: number,
                  @TransactionRepository(UserRepository) userRep?: UserRepository,
                  @TransactionRepository(FinanceRepository) financeRep?: FinanceRepository): Promise<BalanceOperation> {
        return await financeRep.deposit(userId, value, userRep);
    }

    @Transaction()
    async withdraw(userId: number, value: number,
             @TransactionRepository(UserRepository) userRep?: UserRepository,
             @TransactionRepository(FinanceRepository) financeRep?: FinanceRepository): Promise<BalanceOperation>{

        return await financeRep.withdraw(userId, value, userRep);
    }
}