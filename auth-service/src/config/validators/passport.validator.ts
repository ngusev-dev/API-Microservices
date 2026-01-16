import { IsNumber, IsString } from 'class-validator';

export class PassportValidator {
  @IsString()
  PASSPORT_SECRET_KEY: string;

  @IsNumber()
  PASSPORT_TTL_ACCESS: number;

  @IsNumber()
  PASSPORT_TTL_REFRESH: number;
}
