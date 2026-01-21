import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length, Matches } from 'class-validator';

export class ConfirmPhoneChangeRequest {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @Matches(/^(\+?7|8|7)[-\s(]?(\d{3})[-\s)]?(\d{3})[-\s]?(\d{2})[-\s]?(\d{2})$/)
  phone: string;

  @ApiProperty({
    example: '12345',
  })
  @IsNumberString()
  @IsNotEmpty()
  @Length(5, 5)
  public code: string;
}
