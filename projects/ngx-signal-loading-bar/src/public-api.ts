/*
 * Public API Surface of ngx-signal-loading-bar
 */

// Component
export { NgxSignalLoadingBar } from './lib/ngx-signal-loading-bar';

// Service
export { LoadingBar } from './lib/loading-bar';

// Interceptor
export { loadingInterceptor } from './lib/loading-bar.interceptor';

// Config
export {
  LOADING_BAR_CONFIG,
  provideLoadingBar,
} from './lib/loading-bar.config';
export type { LoadingBarConfig } from './lib/loading-bar.config';

// HTTP Context Token
export { IGNORE_SIGNAL_LOADING_BAR } from './lib/loading-bar.interceptor';
