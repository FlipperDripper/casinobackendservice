import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {getConnection, Repository, Transaction, TransactionManager, TransactionRepository} from "typeorm";
import {UserDto} from "./dto/user.dto";
import {BalanceOperation, BalanceOperationType} from "../finance/balanceOperaton.entity";
import {UserRepository} from "./user.repository";

@Injectable()
export class UsersService {
    @Transaction()
    async findAll(@TransactionRepository(UserRepository) userRep?: UserRepository): Promise<User[]> {
        return await userRep!.findAll()
    }
    @Transaction()
    async findOne(login: string, @TransactionRepository(UserRepository) userRep?:UserRepository): Promise<User | undefined>{
        return await userRep!.findByLogin(login)
    }
    @Transaction()
    async findById(id: number, @TransactionRepository(UserRepository) userRep?:UserRepository): Promise<User | undefined>{
        return await userRep!.findById(id);
    }
    @Transaction()
    async createUser(userDto: UserDto, @TransactionRepository(UserRepository) userRep?:UserRepository): Promise<User> {
        return await userRep.createUser(userDto);
    }
    @Transaction()
    async isLoginExist(login: string, @TransactionRepository(UserRepository) userRep?:UserRepository ): Promise<boolean> {
        return userRep!.isLoginExist(login);
    }
}