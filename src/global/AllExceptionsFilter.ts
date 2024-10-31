import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationResponse } from 'src/app/interface';
import * as _ from 'lodash';
interface GenericException {
  message: string;
  errors: string;
  name: string;
  properties: [key: string];
}

interface CustomException {
  message: string;
  statusCode: number;
  error: string;
}

interface MongooseValidation {
  [key: string]: { [x: string]: string };
}
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(
    exception: InternalServerErrorException | GenericException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionInstance =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message;
    const exceptionInstanceGeneric =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.errors;
    /**
     * @description Exception json response
     * @param message
     */

    const responseMessage = (exceptions: ValidationResponse | string): void => {
      let responseData;
      if (typeof exceptions != 'object') {
        const mongoException = exceptionInstanceGeneric as MongooseValidation;
        const mongoErrors = mongoException
          ? _.map(mongoException, (exception) => {
              if (exception && exception.path) {
        const field = exception.path;
        return {
          [field]: [mongoException[field]?.message || 'Unknown error occurred'],
        };
      }
      return { error: 'Unknown error occurred' };
    })
            : exception.message ? [exception.message] : ['Unknown error has occurred'];
          // : [exception.message] || ['Unknown error has occured'];
        status = 400;
        responseData = {
          message: exception.name,
          errors: mongoErrors,
        };
      }

      if (
        typeof exceptions == 'object' &&
        exceptions.message !== 'ValidationError'
      ) {
        const customException = exceptionInstance as CustomException;
        responseData = {
          message: customException.error,
          errors: _.isArray(customException.message)
            ? customException.message
            : [customException.message],
        };
      }

      if (
        typeof exceptions == 'object' &&
        exceptions.message === 'ValidationError'
      ) {
        responseData = { ...exceptions };
      }

      response.status(status).json({
        code: status,
        ...responseData,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    };

    responseMessage(exceptionInstance);
  }
}
