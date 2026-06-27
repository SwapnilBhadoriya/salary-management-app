import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotPastDate', async: false })
export class IsNotPastDateConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: Date) {
    if (!propertyValue || !(propertyValue instanceof Date)) {
      return false;
    }
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const targetDate = new Date(propertyValue);
    targetDate.setUTCHours(0, 0, 0, 0);

    return targetDate.getTime() >= today.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} cannot be a past date`;
  }
}

export function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotPastDateConstraint,
    });
  };
}
