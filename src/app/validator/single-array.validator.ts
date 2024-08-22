import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsStringOrArray(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isStringOrArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value === 'string') return true;
          if (Array.isArray(value)) {
            return value.every((v) => typeof v === 'string');
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return 'tag must be a single string or an array of strings';
        },
      },
    });
  };
}
