import { InjectionToken, Provider } from '@angular/core';

export interface LoadingBarConfig {
  /**
   * Maximum number of times the loading bar will retry failed HTTP requests.
   * The loader wont stop and restart multiple times and treat retries as one request.
   * @default 0
   */
  maxRetryCount?: number;

  /**
   * Timeout in milliseconds before the loading bar automatically completes.
   * @default 30000
   */
  timeoutMS?: number;
}

export const LOADING_BAR_CONFIG = new InjectionToken<LoadingBarConfig>(
  'LOADING_BAR_CONFIG'
);

export function provideLoadingBar(config: LoadingBarConfig): Provider {
  return { provide: LOADING_BAR_CONFIG, useValue: config };
}
