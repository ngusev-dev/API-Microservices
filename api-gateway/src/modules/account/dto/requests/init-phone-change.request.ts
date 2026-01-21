import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class InitPhoneChangeRequest {
  @ApiProperty({
    example: '79163334422',
  })
  @IsNotEmpty()
  @Matches(/^(\+?7|8|7)[-\s(]?(\d{3})[-\s)]?(\d{3})[-\s]?(\d{2})[-\s]?(\d{2})$/)
  phone: string;
}
