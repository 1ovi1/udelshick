import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  success<T>(message: string, data?: T): SuccessResponseDto<T> {
    return new SuccessResponseDto(message, data);
  }

  created<T>(data: T, message = 'Created successfully'): SuccessResponseDto<T> {
    return new SuccessResponseDto(message, data);
  }
}
