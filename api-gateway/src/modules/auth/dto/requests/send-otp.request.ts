/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Validate } from 'class-validator';
import { IdentifierValidator } from 'src/shared/validators';

enum ContactType {
  PHONE = 'phone',
  EMAIL = 'email',
}

export class SendOtpRequest {
  @IsString()
  @Validate(IdentifierValidator)
  @ApiProperty({
    examples: ['test@mail.ru', '79163334422'],
  })
  public identifier: string;

  @IsEnum(ContactType)
  @ApiProperty({
    example: 'phone',
  })
  public type: 'phone' | 'email';
}
