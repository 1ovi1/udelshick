import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { AuthModule } from '@application/auth/auth.module';
import { AdminModule } from '@application/admin/admin.module';
import { CompanyModule } from '@application/company/company.module';

@Module({
  imports: [DatabaseModule, AuthModule, AdminModule, CompanyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
