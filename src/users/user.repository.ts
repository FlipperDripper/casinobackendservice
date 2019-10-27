import {EntityRepository, Repository, UpdateResult} from "typeorm";
import {User} from "./users.entity";
import {UserDto} from "./dto/user.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async findAll(): Promise<User[]>{
        return await this.find();
    }
    async findByLogin(login: string): Promise<User>{
        return await this.findOne( {login});
    }
    async findById(id: number): Promise<User>{
        return await this.findOne(id)
    }
    async createUser(userDto: UserDto): Promise<User>{
        const user = this.create(userDto);
        return await this.save(user);
    }
    async isLoginExist(login): Promise<boolean>{
        const user = await this.findOne( {login})
        return Boolean(user);
    }
    async changeBalance(userId, balance: number): Promise<UpdateResult>{
        return this.update({id: userId}, {balance: balance})
    }

}