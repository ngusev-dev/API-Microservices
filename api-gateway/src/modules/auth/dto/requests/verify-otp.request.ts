import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { IdentifierValidator } from 'src/shared/validators';
import { ContactEnum, type ContactType } from '../../enums';

export class VerifyOtpRequest {
  @ApiProperty({
    examples: ['test@mail.ru', '79163334422'],
  })
  @IsString()
  @Validate(IdentifierValidator)
  public identifier: string;

  @ApiProperty({
    example: '12345',
  })
  @IsNumberString()
  @IsNotEmpty()
  @Length(5, 5)
  public code: string;

  @ApiProperty({
    example: 'phone',
  })
  @IsEnum(ContactEnum)
  public type: ContactType;
}
