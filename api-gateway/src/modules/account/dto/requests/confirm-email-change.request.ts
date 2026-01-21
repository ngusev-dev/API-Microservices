import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class ConfirmEmailChangeRequest {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345',
  })
  @IsNumberString()
  @IsNotEmpty()
  @Length(5, 5)
  code: string;
}
