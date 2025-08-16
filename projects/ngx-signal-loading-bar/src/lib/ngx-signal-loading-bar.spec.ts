import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSignalLoadingBar } from './ngx-signal-loading-bar';
import { LoadingBar } from './loading-bar';
import { signal, computed } from '@angular/core';

describe('NgxSignalLoadingBar', () => {
  let component: NgxSignalLoadingBar;
  let fixture: ComponentFixture<NgxSignalLoadingBar>;
  let progressSignal: ReturnType<typeof signal>;

  const mockLoadingBar: Partial<LoadingBar> = {
    currentProgress: computed(() => progressSignal()) as any, // type-cast to satisfy TS
  };

  beforeEach(async () => {
    progressSignal = signal(0);

    await TestBed.configureTestingModule({
      imports: [NgxSignalLoadingBar],
      providers: [{ provide: LoadingBar, useValue: mockLoadingBar }],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxSignalLoadingBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect progress signal changes', () => {
    expect(component.loadingProgress()).toBe(0);

    progressSignal.set(50);
    expect(component.loadingProgress()).toBe(50);

    progressSignal.set(80);
    expect(component.loadingProgress()).toBe(80);
  });
});
