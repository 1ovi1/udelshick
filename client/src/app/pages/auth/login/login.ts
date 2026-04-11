import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Auth } from '../auth.service';
import { AUTH_ROLE_META } from '../models/auth-role.const';
import { toAuthRouteRole } from '../models/auth-role.utils';
import { getDefaultLayoutPath } from '../../layout/utils/layout-tabs.utils';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly fb = inject(FormBuilder);

  private readonly routeParamMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly roleMeta = computed(() => {
    const role = toAuthRouteRole(this.routeParamMap().get('role'));

    return AUTH_ROLE_META[role];
  });

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      const role = await firstValueFrom(this.auth.login({ email, password }));
      await this.router.navigateByUrl(getDefaultLayoutPath(role));
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        this.errorMessage.set(this.toRuErrorMessage(error));
      } else if (error instanceof Error) {
        this.errorMessage.set(error.message);
      } else {
        this.errorMessage.set('Не удалось выполнить вход.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private toRuErrorMessage(error: HttpErrorResponse): string {
    const rawMessage = error.error?.message;
    const message = Array.isArray(rawMessage) ? rawMessage.join('. ') : rawMessage;

    if (error.status === 0) {
      return 'Сервер недоступен. Проверьте, что backend запущен.';
    }

    if (message === 'Invalid credentials') {
      return 'Неверный email или пароль.';
    }

    if (message === 'Unauthorized') {
      return 'Требуется авторизация.';
    }

    return 'Не удалось выполнить вход.';
  }
}
