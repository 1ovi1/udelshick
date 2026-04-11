import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    example: 'candidate-550e8400-e29b-41d4-a716-446655440000',
    description: 'ID профиля пользователя',
  })
  id: string;

  @ApiProperty({
    example: 'auth-123',
    description: 'ID аутентификации',
    required: false,
  })
  authId?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Имя пользователя',
  })
  name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Фамилия пользователя',
    required: false,
    nullable: true,
  })
  lastname?: string;

  @ApiProperty({
    example: 25,
    description: 'Возраст пользователя',
    required: false,
  })
  age?: number;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'Регистрация успешна - вы залогированы',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    example: 'auth-550e8400-e29b-41d4-a716-446655440000',
    description: 'ID аутентификации пользователя',
    required: false,
  })
  authId?: string;

  @ApiProperty({
    example: 'candidate-550e8400-e29b-41d4-a716-446655440000',
    description: 'ID профиля пользователя',
    required: false,
  })
  profileId?: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoLTEyMyIsImVtYWlsIjoiInVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiY2FuZGlkYXRlIn0.abcdef',
    description: 'JWT токен доступа',
  })
  access_token: string;
}
