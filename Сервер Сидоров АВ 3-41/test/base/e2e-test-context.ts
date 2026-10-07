import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { configureApplication } from '../../src/bootstrap/configure-application';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { resetDatabase } from '../helpers/database.helper';

export class E2eTestContext {
  private constructor(
    readonly app: INestApplication,
    readonly http: any,
    readonly dataSource: DataSource,
  ) {}

  static async create(): Promise<E2eTestContext> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    configureApplication(app);
    await app.init();

    const dataSource = app.get(DataSource);
    await resetDatabase(dataSource);

    const http = (request as any).default || request;

    return new E2eTestContext(app, http(app.getHttpServer()), dataSource);
  }

  async resetDb(): Promise<void> {
    await resetDatabase(this.dataSource);
  }

  async close(): Promise<void> {
    await this.app.close();
  }

  authHeader(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
