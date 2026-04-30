import { ApiProperty } from '@nestjs/swagger';

export class CandidatePaginationMetaDto {
  @ApiProperty({ example: 1, description: 'Текущая страница' })
  page: number;

  @ApiProperty({ example: 10, description: 'Размер страницы' })
  limit: number;

  @ApiProperty({ example: 25, description: 'Общее количество записей' })
  total: number;

  @ApiProperty({ example: 3, description: 'Общее число страниц' })
  totalPages: number;
}
