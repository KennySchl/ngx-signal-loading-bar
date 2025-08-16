import { TestBed } from '@angular/core/testing';
import { LoadingBar } from './loading-bar';
import { DestroyRef } from '@angular/core';

describe('LoadingBar (public API)', () => {
  let service: LoadingBar;
  let destroyRefMock: Partial<DestroyRef>;

  beforeEach(() => {
    destroyRefMock = { onDestroy: jasmine.createSpy('onDestroy') };

    TestBed.configureTestingModule({
      providers: [
        LoadingBar,
        { provide: DestroyRef, useValue: destroyRefMock },
      ],
    });

    service = TestBed.inject(LoadingBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start loading and update progress and isLoading', () => {
    expect(service.isLoading()).toBeFalse();
    expect(service.currentProgress()).toBe(0);

    service.startLoading();

    expect(service.isLoading()).toBeTrue();
    expect(service.currentProgress()).toBeGreaterThan(0);
  });

  it('should complete loading and reset progress after timeout', (done) => {
    service.startLoading();
    service.completeLoading();

    // Immediately after completeLoading, progress should be 100
    expect(service.currentProgress()).toBe(100);
    expect(service.isLoading()).toBeTrue(); // still "loading" because progress hasn’t reset yet

    // Wait for progress reset (250ms in service)
    setTimeout(() => {
      expect(service.currentProgress()).toBe(0);
      expect(service.isLoading()).toBeFalse();
      done();
    }, 300);
  });

  it('incrementRetryCount should increase loading and reset after max retries', () => {
    // Call incrementRetryCount multiple times
    service.incrementRetryCount();
    // Since maxRetry = 0, loading should immediately reset
    expect(service.isLoading()).toBeFalse();
    expect(service.currentProgress()).toBe(0);

    // We can still verify that calling startLoading after retry works
    service.startLoading();
    expect(service.isLoading()).toBeTrue();
    expect(service.currentProgress()).toBeGreaterThan(0);
  });

  it('TIMEOUT_MS getter should return configured timeout', () => {
    expect(service.TIMEOUT_MS).toBe(30_000);
  });

  it('should reactively update progress over time while loading', (done) => {
    service.startLoading();

    const initialProgress = service.currentProgress();

    // Wait a bit to allow the progress timer to increment
    setTimeout(() => {
      const laterProgress = service.currentProgress();
      expect(laterProgress).toBeGreaterThan(initialProgress);

      service.completeLoading();
      done();
    }, 300);
  });
});
