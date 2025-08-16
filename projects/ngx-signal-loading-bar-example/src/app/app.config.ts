import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { loadingInterceptor, provideLoadingBar } from 'ngx-signal-loading-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideLoadingBar({ maxRetryCount: 3, timeoutMS: 15_000 }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor])),
  ],
};
