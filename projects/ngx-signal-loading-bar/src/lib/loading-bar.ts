import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { LOADING_BAR_CONFIG, LoadingBarConfig } from './loading-bar.config';

@Injectable({
  providedIn: 'root',
})
export class LoadingBar {
  readonly #config: Required<LoadingBarConfig> = {
    maxRetryCount: 0,
    timeoutMS: 30_000,
    ...(inject(LOADING_BAR_CONFIG, { optional: true }) ?? {}),
  };
  readonly #destroyRef = inject(DestroyRef);

  readonly #MAX_RETRY_COUNT = this.#config.maxRetryCount;
  readonly #INITIAL_PROGRESS_VALUE = 2;

  readonly #loadingCount = signal<number>(0);
  readonly #loadingProgress = signal<number>(0);
  readonly #currentRetryCount = signal<number>(0);
  readonly isLoading = computed(
    () => this.#loadingCount() > 0 || this.#loadingProgress() > 0
  );
  readonly currentProgress = computed(() => this.#loadingProgress());

  #progressTimer: ReturnType<typeof setInterval> | null = null;

  get TIMEOUT_MS(): number {
    return this.#config.timeoutMS;
  }

  constructor() {
    this.#setupProgressIncrementer();
  }

  startLoading(): void {
    this.#loadingCount.update((count) => count + 1);
    if (this.#currentRetryCount() === 0) {
      this.#loadingProgress.set(this.#INITIAL_PROGRESS_VALUE);
    }
  }

  completeLoading(): void {
    this.#loadingCount.update((count) => count - 1);
    if (this.#loadingCount() <= 0) {
      this.#clearProgressTimer();
      this.#loadingProgress.set(100);
      setTimeout(() => this.#loadingProgress.set(0), 250);
    }
  }

  incrementRetryCount(): void {
    this.#currentRetryCount.update((count) => count + 1);
    this.#loadingCount.update((count) => count + 1);
    if (this.#currentRetryCount() >= this.#MAX_RETRY_COUNT) {
      this.#loadingCount.set(this.#loadingCount() - this.#MAX_RETRY_COUNT);
      this.#currentRetryCount.set(0);
    }
  }

  #calculateProgress(): void {
    const currentProgress = this.#loadingProgress();
    let progressIncrement = 0;

    // Don't increment if already at 100%
    if (currentProgress >= 100) {
      return;
    }

    if (currentProgress >= 0 && currentProgress < 25) {
      // Early stage: increase between 3% and 6%
      progressIncrement = Math.random() * (6 - 3) + 3;
    } else if (currentProgress >= 25 && currentProgress < 65) {
      // Mid stage: increase between 0% and 3%
      progressIncrement = Math.random() * 3;
    } else if (currentProgress >= 65 && currentProgress < 90) {
      // Late stage: increase between 0% and 2%
      progressIncrement = Math.random() * 2;
    } else if (currentProgress >= 90 && currentProgress < 99) {
      // Final stretch: fixed 0.5% increment
      progressIncrement = 0.5;
    } else if (currentProgress >= 99 && currentProgress < 100) {
      // Ensure we reach exactly 100%
      progressIncrement = 100 - currentProgress;
    }

    const newProgress = Math.min(currentProgress + progressIncrement, 100);
    this.#loadingProgress.set(newProgress);
  }

  #setupProgressIncrementer(): void {
    effect(() => {
      if (!this.isLoading()) {
        return;
      }

      this.#progressTimer = setInterval(() => {
        const currentProgress = this.#loadingProgress();
        const loadingCount = this.#loadingCount();

        // Only increment if we're actively loading and not at 100%
        if (loadingCount > 0 && currentProgress < 100) {
          this.#calculateProgress();
        }
      }, 250);
    });

    // Cleanup on destroy
    this.#destroyRef.onDestroy(() => {
      this.#clearProgressTimer();
    });
  }

  #clearProgressTimer(): void {
    if (this.#progressTimer) {
      clearInterval(this.#progressTimer);
      this.#progressTimer = null;
    }
  }
}
