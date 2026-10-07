import { Role } from '@domain/entities/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Пароль',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: Role,
    description: 'Роль пользователя',
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    example: 'John',
    description: 'Имя',
    required: false,
  })
  @ValidateIf((o: RegisterAuthDto) => o.role === Role.CANDIDATE)
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Фамилия',
    required: false,
  })
  @ValidateIf((o: RegisterAuthDto) => o.role === Role.CANDIDATE)
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: '+7 999 999 99 99',
    description: 'Телефон',
    required: false,
  })
  @ValidateIf(
    (o: RegisterAuthDto) =>
      o.role === Role.CANDIDATE || o.role === Role.COMPANY,
  )
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'TechCorp LLC',
    description: 'Название компании',
    required: false,
  })
  @ValidateIf((o: RegisterAuthDto) => o.role === Role.COMPANY)
  @IsString()
  companyName?: string;

  @ApiProperty({
    example: 'John Smith',
    description: 'Контактное лицо',
    required: false,
  })
  @ValidateIf((o: RegisterAuthDto) => o.role === Role.COMPANY)
  @IsString()
  contactPerson?: string;

  @ApiProperty({
    example: 'ул. Примерная, 123, г. Москва',
    description: 'Адрес компании',
    required: false,
  })
  @ValidateIf((o: RegisterAuthDto) => o.role === Role.COMPANY)
  @IsString()
  address?: string;
}
