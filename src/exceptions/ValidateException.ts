
import {ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ValidateException implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;
        response
            .status(status)
            .json({
                status: 'error',
                error: exception.message
            });
    }
}