import { ApiProperty } from '@nestjs/swagger';

export class HealthResponse {
  @ApiProperty({
    example: 'OK',
  })
  status: string;

  @ApiProperty({
    example: '2026-01-07T16:50:00.000Z',
  })
  timestamp: string;
}
