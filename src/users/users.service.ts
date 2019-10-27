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
    async findOne(login: string): Promise<User | undefined>{
        try {
            return await this.userRepository.manager.transaction((async manager => {
                return manager.findOne(User, {login});
            }));
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    async findById(id: number): Promise<User | undefined>{
        try{
            return await this.userRepository.manager.transaction((async manager =>{
                return manager.findOne(User, {id});
            }))
        }catch(e){
            console.error(e);
            throw e;
        }
    }


    async createUser(userDto: UserDto): Promise<User> {
        try{
            return await this.userRepository.manager.transaction((async manager=>{
                const user = manager.create(User, userDto);
                const savedUser = await manager.save(user);
                delete savedUser.password;
                return savedUser;
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