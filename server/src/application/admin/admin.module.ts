import { AdminController } from '@api/controllers/admin.controller';
import { RolesGuard } from '@api/guards/roles.guard';
import { AdminService } from '@application/services/admin.service';
import { ResponseService } from '@application/services/response.service';
import { AuthEntity } from '@infrastructure/entities/auth.entity';
import { ApplicationEntity } from '@infrastructure/entities/application.entity';
import { VacancyEntity } from '@infrastructure/entities/vacancy.entity';
import { AdminRepository } from '@infrastructure/repository/admin.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity, VacancyEntity, ApplicationEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository, ResponseService, RolesGuard],
})
export class AdminModule {}
