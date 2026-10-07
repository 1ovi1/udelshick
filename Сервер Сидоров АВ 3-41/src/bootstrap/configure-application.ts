import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ProblemDetailsFilter } from '@api/filters/problem-details.filter';

export function configureApplication(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new ProblemDetailsFilter());
}
