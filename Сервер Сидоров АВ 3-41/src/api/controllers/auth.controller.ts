import { LoginAuthDto } from '@api/dto/auth/login-auth.dto';
import { RegisterAuthDto } from '@api/dto/auth/register-auth.dto';
import { AuthService } from '@application/services/auth.service';
import { ResponseService } from '@application/services/response.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации данных',
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь уже существует',
  })
  async register(@Body() dto: RegisterAuthDto) {
    const result = await this.authService.register(dto);
    return this.responseService.created(result, 'Регистрация успешна');
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход пользователя в систему' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно залогирован',
  })
  @ApiResponse({
    status: 401,
    description: 'Неверные учётные данные',
  })
  async login(@Body() dto: LoginAuthDto) {
    const result = await this.authService.login(dto);
    return this.responseService.success('Вход успешен', result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Получение информации текущего пользователя' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Информация профиля получена успешно',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  async me(@Request() req: { user: { id: string } }) {
    const result = await this.authService.me(req.user.id);
    return this.responseService.success('Профиль получен', result);
  }
}
