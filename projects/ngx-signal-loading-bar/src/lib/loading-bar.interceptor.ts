import {
  HTTP_INTERCEPTORS,
  HttpContextToken,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Provider } from '@angular/core';
import {
  catchError,
  finalize,
  Observable,
  tap,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import { LoadingBar } from './loading-bar';

export const IGNORE_SIGNAL_LOADING_BAR = new HttpContextToken<boolean>(
  () => false
);

export function loadingInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  if (request.context.get(IGNORE_SIGNAL_LOADING_BAR)) {
    return next(request);
  }

  const loadingService = inject(LoadingBar);

  const TIMEOUT_MS = loadingService.TIMEOUT_MS;

  // We create a flag to ensure the current state of loading in case the request is canceled before anything is emitted
  let hasStarted = false;

  return next(request).pipe(
    timeout(TIMEOUT_MS),
    tap(() => {
      if (!hasStarted) {
        loadingService.startLoading();
        hasStarted = true;
      }
    }),
    catchError((error) => {
      if (error instanceof TimeoutError) {
        console.warn('Request timed out:', request.url);
        loadingService.completeLoading();
      }
      loadingService.incrementRetryCount();
      return throwError(() => error);
    }),
    finalize(() => {
      if (hasStarted) {
        loadingService.completeLoading();
      }
    })
  );
}
