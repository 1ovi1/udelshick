import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Auth } from '../auth.service';
import { AUTH_ROLE_META } from '../models/auth-role.const';
import { toAuthRouteRole } from '../models/auth-role.utils';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { getDefaultLayoutPath } from '../../layout/utils/layout-tabs.utils';

@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NgxMaskDirective,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
  providers: [provideNgxMask()],
})
export class Registration {
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

  protected readonly isUserRegistration = computed(() => this.roleMeta().routeRole === 'user');
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly userForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(7)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  );

  protected readonly companyForm = this.fb.nonNullable.group(
    {
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      contactPerson: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
      ],
      phone: [
        '',
        [Validators.required, Validators.minLength(7), Validators.pattern(/^[0-9+\-\s()]{7,20}$/)],
      ],
      address: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  );

  protected async onSubmit(): Promise<void> {
    if (this.isUserRegistration()) {
      if (this.userForm.invalid) {
        this.userForm.markAllAsTouched();
        return;
      }

      const userValue = this.userForm.getRawValue();

      this.isSubmitting.set(true);
      this.errorMessage.set(null);

      try {
        const role = await firstValueFrom(
          this.auth.registerUser({
            firstName: userValue.firstName,
            lastName: userValue.lastName,
            email: userValue.email,
            phone: userValue.phone,
            password: userValue.password,
          }),
        );

        await this.router.navigateByUrl(getDefaultLayoutPath(role));
      } catch (error: unknown) {
        if (error instanceof HttpErrorResponse) {
          this.errorMessage.set(this.toRuErrorMessage(error));
        } else if (error instanceof Error) {
          this.errorMessage.set(error.message);
        } else {
          this.errorMessage.set('Не удалось завершить регистрацию.');
        }
      } finally {
        this.isSubmitting.set(false);
      }

      return;
    }

    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    const companyValue = this.companyForm.getRawValue();

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      const role = await firstValueFrom(
        this.auth.registerCompany({
          companyName: companyValue.companyName,
          contactPerson: companyValue.contactPerson,
          email: companyValue.email,
          phone: companyValue.phone,
          address: companyValue.address,
          password: companyValue.password,
        }),
      );

      await this.router.navigateByUrl(getDefaultLayoutPath(role));
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        this.errorMessage.set(this.toRuErrorMessage(error));
      } else if (error instanceof Error) {
        this.errorMessage.set(error.message);
      } else {
        this.errorMessage.set('Не удалось завершить регистрацию.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const currentErrors = { ...(confirmPasswordControl.errors ?? {}) };

    if (passwordControl.value !== confirmPasswordControl.value) {
      if (!currentErrors['notSame']) {
        confirmPasswordControl.setErrors({ ...currentErrors, notSame: true });
      }
      return { passwordMismatch: true };
    }

    if (currentErrors['notSame']) {
      delete currentErrors['notSame'];
      confirmPasswordControl.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
    }

    return null;
  }

  private toRuErrorMessage(error: HttpErrorResponse): string {
    const rawMessage = error.error?.message;
    const message = Array.isArray(rawMessage) ? rawMessage.join('. ') : rawMessage;

    if (error.status === 0) {
      return 'Сервер недоступен. Проверьте, что backend запущен.';
    }

    if (message === 'User already exists') {
      return 'Пользователь с таким e-mail уже существует.';
    }

    if (typeof message === 'string' && message.length > 0) {
      return `Ошибка регистрации: ${message}`;
    }

    return 'Не удалось завершить регистрацию.';
  }
}
