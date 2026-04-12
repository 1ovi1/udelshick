import { AdminActivityStatus } from '@domain/entities/enums/admin-activity-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AdminActivityItemDto {
  @ApiProperty({ example: 'auth-9f22b8f2-98d9-44f2-8a80-a7c8d6c3f65f' })
  authId: string;

  @ApiProperty({
    enum: AdminActivityStatus,
    example: AdminActivityStatus.CANDIDATE,
    description: 'Тип записи в активности',
  })
  status: AdminActivityStatus;

  @ApiProperty({
    example: 'Андрей Куликов',
    description: 'Имя кандидата или название компании',
  })
  name: string;

  @ApiProperty({
    example: 'andrey@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({
    example: '2026-04-12T09:15:00.000Z',
    description: 'Дата и время создания',
  })
  createdAt: string;
}
