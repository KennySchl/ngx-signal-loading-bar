import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NgxSignalLoadingBar } from 'ngx-signal-loading-bar';
import { concatMap, forkJoin, retry, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [NgxSignalLoadingBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly #http = inject(HttpClient);

  makeRequest(): void {
    // Example HTTP request to test loading bar
    this.#http
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .subscribe(console.log);
  }

  makeMultipleSimultaneousRequests(): void {
    // Example HTTP request to test loading bar with multiple simultaneous requests
    forkJoin([
      this.#http.get('https://jsonplaceholder.typicode.com/todos/1'),
      this.#http.get('https://jsonplaceholder.typicode.com/todos/2'),
    ]).subscribe(console.log);
  }

  makeMultipleSequentialRequests(): void {
    // Example HTTP request to test loading bar with multiple sequential requests
    this.#http
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .pipe(
        concatMap((response1) => {
          console.log(response1);
          return this.#http.get('https://jsonplaceholder.typicode.com/todos/2');
        })
      )
      .subscribe(console.log);
  }

  makeInvalidRequestToTestRetry(): void {
    // Example invalid HTTP request to test loading bar with error to test retry
    this.#http
      .get('https://httpstat.us/500')
      .pipe(
        retry({
          // Count should match config maxRetryCount
          count: 3,
          delay: (error, retryCount) => {
            // Exponential backoff: 1s, 2s, 4s ...
            const backoffTime = 1000 * Math.pow(2, retryCount - 1);
            console.error(error);
            console.log(`Retry #${retryCount} in ${backoffTime}ms`);
            return timer(backoffTime);
          },
        })
      )
      .subscribe(console.log);
  }
}
