import {BadRequestException, Inject, Injectable, PipeTransform} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {UserDto} from "../users/dto/user.dto";

@Injectable()
export class LoginValidator implements PipeTransform<any> {
    @Inject(UsersService)
    private readonly userService: UsersService
    async transform(params: UserDto) {
        const userExist = await this.userService.isLoginExist(params.login);
        if(!userExist) throw new BadRequestException('User with this login does not exist')
        else return params;
    }
}
