import { Component, computed, inject, input } from '@angular/core';
import { LoadingBar } from './loading-bar';

@Component({
  selector: 'ngx-signal-loading-bar',
  imports: [],
  template: `
    <ng-container>
      @if (loadingProgress() > 0) {
      <div
        id="global-loading-bar"
        [style.width.%]="loadingProgress()"
        [style.height.px]="barHeight()"
        [style.background]="barGradient()"
        [style.box-shadow]="boxShadow()"
      ></div>
      }
    </ng-container>
  `,
  styles: `
    #global-loading-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10001;
    border-radius: 0 2px 2px 0;
    [dir='rtl'] & {
      right: 0;
      left: unset;
      border-radius: 2px 0 0 2px;
    }
  }
  `,
})
export class NgxSignalLoadingBar {
  readonly #loadingBar = inject(LoadingBar);
  /**
   * Height of the loading bar in pixels.
   * @default 2
   */
  readonly barHeight = input<number>(4);

  /**
   * CSS color of the loading bar.
   * Accepts any valid CSS color value (hex, rgb, hsl, named colors).
   * @default "#f637e3"
   */
  readonly barColor = input<string>('#f637e3');

  readonly loadingProgress = computed(() => this.#loadingBar.currentProgress());

  readonly barGradient = computed(
    () =>
      `linear-gradient(90deg, ${this.barColor()}, ${this.#lighten(
        this.barColor(),
        0.1
      )})`
  );

  readonly boxShadow = computed(() => {
    const color = this.barColor();
    return `0 0 8px rgba(${this.#hexToRgb(color)}, 0.3)`;
  });

  // Simple lighten function using HSL
  #lighten(color: string, amount: number) {
    const c = color.startsWith('#') ? parseInt(color.slice(1), 16) : 0;
    const r = (c >> 16) + amount * 255;
    const g = ((c >> 8) & 0xff) + amount * 255;
    const b = (c & 0xff) + amount * 255;
    return `rgb(${r},${g},${b})`;
  }

  // Helper to convert hex to rgb
  #hexToRgb(hex: string) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  }
}
