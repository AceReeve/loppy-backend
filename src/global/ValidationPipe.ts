import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as _ from 'lodash';
import { GenericResponse, ValidationResponse } from 'src/app/interface';

@Injectable()
export class ValidationPipe implements PipeTransform<GenericResponse> {
  async transform(
    value: GenericResponse,
    { metatype }: ArgumentMetadata,
  ): Promise<GenericResponse> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance<object, GenericResponse>(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const response = this.transformValidation(errors);
      throw new BadRequestException(response);
    }
    return value;
  }

  private getChildrenErrors(errors: ValidationError[]): any {
    const childErrors: any = []
    _.map(errors, (validationErr: ValidationError) => {
      const getChildErrors = (childErr: ValidationError[] | undefined) => {
        if(!validationErr.constraints && childErr) {
            return _.map(childErr, (deepChild: ValidationError) => {
            if(_.isEmpty(deepChild.children)) {
              childErrors.push(deepChild);
              return;
            };
            getChildErrors(deepChild.children);
          });
        }
      }
      if(!validationErr.constraints) getChildErrors(validationErr.children);
    });

    return childErrors;
  }

  private transformValidation(errors: ValidationError[]): ValidationResponse {
    let childErrs = this.getChildrenErrors(errors);
    let compactErrors = _.concat(_.filter(errors, (validationError: ValidationError) => validationError.constraints !== undefined), childErrs);

    const transformedError = _.map(compactErrors, (validationErr: ValidationError) => {
      const key = validationErr.property;
      return {
        [key]: _.map(validationErr.constraints, (constraint) => constraint),
      };
    });

    return {
      errors: transformedError,
      message: 'ValidationError',
    };
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
