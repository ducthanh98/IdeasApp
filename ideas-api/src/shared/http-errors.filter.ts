import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        console.log(exception)
        const status = exception.getStatus() || 400;
        const errorResponse = {
            code: status,
            timestamp: new Date().toLocaleDateString(),
            path: request.url,
            method: response.method,
            message: exception.message.error || exception.message || null,
        };
        Logger.error(`${request.method} ${request.url}`, exception.stack, 'Exception Filter');
        response.status(status).json(errorResponse);
    }
}
