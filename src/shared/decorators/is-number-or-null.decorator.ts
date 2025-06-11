import { isInt, registerDecorator, ValidationOptions } from 'class-validator';

export default function IsNullOrNumberDecorator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: unknown) {
          return value === 'null' || value === null || isInt(value);
        },
      },
    });
  };
}
