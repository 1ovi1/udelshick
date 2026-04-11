import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { ru_RU, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import ru from '@angular/common/locales/ru';
import { authTokenInterceptor } from './interceptors/auth-token.interceptor';
import { Auth } from './pages/auth/auth.service';

registerLocaleData(ru);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer((auth = inject(Auth)) => auth.initialize()),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideNzIcons(icons),
    provideNzI18n(ru_RU),
  ],
};
