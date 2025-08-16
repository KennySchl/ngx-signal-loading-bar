import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NgxSignalLoadingBar } from 'ngx-signal-loading-bar';

@Component({
  selector: 'app-root',
  imports: [NgxSignalLoadingBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly #http = inject(HttpClient);

  makeRequest() {
    // Example HTTP request to test loading bar
    this.#http
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .subscribe(console.log);
  }
}
