import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ProblemDetailsBody {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
  errors?: string[];
}

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const details = this.extractDetails(exception, status);

    const body: ProblemDetailsBody = {
      type: `https://httpstatuses.com/${status}`,
      title: details.title,
      status,
      detail: details.detail,
      instance: request.url,
      timestamp: new Date().toISOString(),
    };

    if (details.errors.length > 0) {
      body.errors = details.errors;
    }

    response.status(status).json(body);
  }

  private extractDetails(
    exception: unknown,
    status: number,
  ): { title: string; detail: string; errors: string[] } {
    const fallbackTitle = this.statusToTitle(status);
    const fallbackDetail =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : fallbackTitle;

    if (!(exception instanceof HttpException)) {
      return {
        title: fallbackTitle,
        detail: fallbackDetail,
        errors: [],
      };
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return {
        title: fallbackTitle,
        detail: response,
        errors: [],
      };
    }

    if (this.isHttpExceptionResponse(response)) {
      const message = response.message;
      const errors = Array.isArray(message)
        ? message.map((item) => String(item))
        : [];

      return {
        title: response.error ?? fallbackTitle,
        detail: Array.isArray(message) ? message.join('; ') : String(message),
        errors,
      };
    }

    return {
      title: fallbackTitle,
      detail: fallbackDetail,
      errors: [],
    };
  }

  private isHttpExceptionResponse(
    value: unknown,
  ): value is { message: string | string[]; error?: string } {
    if (!value || typeof value !== 'object') {
      return false;
    }

    if (!('message' in value)) {
      return false;
    }

    const message = (value as { message: unknown }).message;
    return (
      typeof message === 'string' ||
      (Array.isArray(message) &&
        message.every((item) => typeof item === 'string'))
    );
  }

  private statusToTitle(status: number): string {
    return HttpStatus[status] ?? 'Http Error';
  }
}
