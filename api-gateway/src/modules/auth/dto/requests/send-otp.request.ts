import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Validate } from 'class-validator';
import { IdentifierValidator } from 'src/shared/validators';
import { ContactEnum, type ContactType } from '../../enums';

export class SendOtpRequest {
  @ApiProperty({
    example: '79163334422',
  })
  @IsString()
  @Validate(IdentifierValidator)
  public identifier: string;

  @ApiProperty({
    example: 'phone',
  })
  @IsEnum(ContactEnum)
  public type: ContactType;
}
