/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SendOtpRequest } from 'src/modules/auth/dto';

@ValidatorConstraint({ name: 'IdentifierValidator', async: false })
export class IdentifierValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const object = args.object as SendOtpRequest;

    if (object.type === 'email') {
      return (
        typeof value === 'string' &&
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
      );
    }

    if (object.type === 'phone') {
      return (
        typeof value === 'string' &&
        /^(\+?7|8|7)[-\s(]?(\d{3})[-\s)]?(\d{3})[-\s]?(\d{2})[-\s]?(\d{2})$/.test(
          value,
        )
      );
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as SendOtpRequest;

    if (object.type === 'email') return 'Identifier must be a valid email';
    if (object.type === 'phone')
      return 'Identifier must be a valid phone number';

    return 'Invalid identifier';
  }
}
