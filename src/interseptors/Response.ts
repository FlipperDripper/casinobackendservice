import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import instantiate = WebAssembly.instantiate;
import {UserDto} from "../users/dto/user.dto";
import {User} from "../users/users.entity";

export interface Response<T> {
    data: T;
    status: 'ok'
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(map(data => {
            return {status: 'ok', data}
        }))
    };
}
