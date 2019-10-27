import {
    Body, ClassSerializerInterceptor,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwtAuth.guard";
import {FinanceService} from "./finance.service";
import {OperationDto} from "./dto/operation.dto";
import {BalanceOperation} from "./balanceOperaton.entity";


@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('finance')
export class FinanceController{
   constructor(
       private readonly financeService: FinanceService
   ){}
   @Post('deposit')
   async deposit(@Body() operationDto: OperationDto):Promise<BalanceOperation>{
        return await this.financeService.deposit(operationDto.userId, operationDto.value);
   }
    @Post('withdraw')
    async withdraw(@Body() operationDto: OperationDto):Promise<BalanceOperation>{
        return await this.financeService.withdraw(operationDto.userId, operationDto.value);
    }
}