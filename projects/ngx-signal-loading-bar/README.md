# ngx-signal-loading-bar

A lightweight, **signal-based, zoneless loading bar for Angular 20**. Tracks HTTP requests via `HttpClient` and provides a reactive progress bar component with **standalone components and interceptors**.

![npm](https://img.shields.io/npm/v/ngx-signal-loading-bar) ![license](https://img.shields.io/npm/l/ngx-signal-loading-bar)

---

## Features

- Fully **signal-based**: automatic updates with Angular 20 signals
- **Standalone**: no NgModule required
- **Zoneless**: works in applications using `provideZonelessChangeDetection()`
- HTTP interceptor automatically tracks requests
- Configurable **height, color, timeout, and retry behavior**
- Supports multiple concurrent HTTP requests

---

## Installation

```bash
npm install ngx-signal-loading-bar
```

> Angular 16.1 or later (with signal support) is required.

---

## Setup

### 1. Provide the service and interceptor

In your `app.config.ts`:

```ts
import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideZonelessChangeDetection } from "@angular/zone-less";
import { App } from "./app";
import { provideLoadingBar, loadingInterceptor } from "ngx-signal-loading-bar";

export const appConfig = {
  providers: [
    provideZonelessChangeDetection(), // > Only Angular versions 20+
    provideHttpClient(withInterceptors([loadingInterceptor])),
    provideLoadingBar({
      maxRetryCount: 3,
      timeoutMS: 15_000,
    }),
  ],
};
```

- `maxRetryCount` → maximum number of retries to treat failed requests as a single loader
- `timeoutMS` → timeout before the loader automatically completes

---

### 2. Add the component to your template

```html
<ngx-signal-loading-bar [barHeight]="2" [barColor]="'#f11653'"></ngx-signal-loading-bar>

<div style="margin-top: 20px;">
  <button (click)="makeRequest()">Test Single Request</button>
</div>
```

- `barHeight` — height of the loader in pixels
- `barColor` — CSS color for the loader

---

### 3. Example component usage

```ts
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { NgxSignalLoadingBar } from "ngx-signal-loading-bar";

@Component({
  selector: "app-root",
  imports: [NgxSignalLoadingBar],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  readonly #http = inject(HttpClient);

  makeRequest() {
    // Example HTTP request to test loading bar
    this.#http.get("https://jsonplaceholder.typicode.com/todos/1").subscribe(console.log);
  }
}
```

---

### 4. Ignore specific requests

```ts
import { HttpContext } from "@angular/common/http";
import { IGNORE_SIGNAL_LOADING_BAR } from "ngx-signal-loading-bar";

this.http.get("https://example.com/api", {
  context: new HttpContext().set(IGNORE_SIGNAL_LOADING_BAR, true),
});
```

Requests with `IGNORE_SIGNAL_LOADING_BAR` **will not trigger the loading bar**.

---

## API

### Component: `NgxSignalLoadingBar`

| Input       | Type     | Default   | Description                    |
| ----------- | -------- | --------- | ------------------------------ |
| `barHeight` | `number` | `4`       | Height of the loader in pixels |
| `barColor`  | `string` | `#f637e3` | CSS color of the loader        |

### Service: `LoadingBar`

- `startLoading()` → manually start the loader
- `completeLoading()` → manually complete the loader
- `incrementRetryCount()` → increase retry count for failed requests
- Signals: `isLoading`, `currentProgress`

### Config: `LoadingBarConfig`

| Property        | Type     | Default | Description                                                     |
| --------------- | -------- | ------- | --------------------------------------------------------------- |
| `maxRetryCount` | `number` | `0`     | Maximum retries before loader treats failures as single request |
| `timeoutMS`     | `number` | `30000` | Timeout in milliseconds before loader auto-completes            |

### Interceptor: `loadingInterceptor`

- Tracks all outgoing HTTP requests automatically.
- Add to `provideHttpClient(withInterceptors([loadingInterceptor]))`.

---

## Dynamic Gradient & Box-Shadow

- The loader automatically applies a **linear gradient** based on the `barColor` input.
- Box-shadow dynamically updates to match `barColor`.
- Width updates automatically with HTTP requests.
- Height is controlled via `[barHeight]`.

---

## License

MIT © Kenneth Schlappkohl
