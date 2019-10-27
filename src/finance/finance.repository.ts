import {EntityRepository, Repository} from "typeorm";
import {BalanceOperation} from "./balanceOperaton.entity";
import {OperationDto} from "./dto/operation.dto";
import {User} from "../users/users.entity";

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
}