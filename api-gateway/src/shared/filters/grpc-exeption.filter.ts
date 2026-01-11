/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { grpcToHttpStatus } from '../utils';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (this.isGrpcError(exception)) {
      const status = grpcToHttpStatus[exception.code] || 500;

      return response.status(status).json({
        statusCode: status,
        message: exception.details || 'gRPC error',
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      return response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }

  private isGrpcError(exception: any): boolean {
    return (
      typeof exception === 'object' &&
      'code' in exception &&
      'details' in exception
    );
  }
}
