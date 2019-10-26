import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {Repository} from "typeorm";
import {UserDto} from "./dto/user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.userRepository.manager.transaction((async manager => {
                return manager.find(User);
            }));
        } catch (e) {
            console.error(e);
            throw e;
        }
    }


    async createUser(userDto: UserDto): Promise<User> {
        try{
            return await this.userRepository.manager.transaction((async manager=>{
                const user = manager.create(User, userDto);
                return await manager.save(user);
            }))
        }catch (e) {
            console.error(e);
            throw e;
        }
    }
    async isLoginExist(login: string): Promise<boolean> {
        try{
            const user = await this.userRepository.manager.findOne(User, {login: login})
            return Boolean(user);
        }catch (e) {
            console.error(e);
            throw e;
        }
    }
}