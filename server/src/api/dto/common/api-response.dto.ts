import { ApiProperty } from '@nestjs/swagger';

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  timestamp: string;
}

export class SuccessResponseDto<T = unknown> implements ApiResponse<T> {
  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Операция выполнена успешно',
  })
  message: string;

  @ApiProperty({
    description: 'Данные ответа',
    required: false,
  })
  data?: T;

  @ApiProperty({
    description: 'Временная метка ответа',
    example: '2026-03-29T10:30:00.000Z',
  })
  timestamp: string;

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}
