import { Module } from '@nestjs/common';
import {FinanceService} from "./finance.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BalanceOperation} from "./balanceOperaton.entity";
import {UsersModule} from "../users/users.module";
import {FinanceController} from "./finance.controller";

@Module({
    imports: [TypeOrmModule.forFeature([BalanceOperation])],
    providers:[FinanceService],
    exports: [FinanceService],
    controllers: [FinanceController]
})
export class FinanceModule {}
