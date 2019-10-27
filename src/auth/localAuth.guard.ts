
import {Injectable, CanActivate, ExecutionContext, Inject} from '@nestjs/common';
import {LoginDto} from "../users/dto/login.dto";
import {AuthService} from "./auth.service";

@Injectable()
export class LocalAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request;
        const userFields: LoginDto = <LoginDto><unknown>request.body;
        let user = null;
        if(userFields.login && userFields.password) {
            user = await this.authService.validateUser(userFields.login, userFields.password);
            return Boolean(user);
        }
        return false;
    }
}