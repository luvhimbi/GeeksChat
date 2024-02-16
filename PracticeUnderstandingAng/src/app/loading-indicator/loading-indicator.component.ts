import { Component } from '@angular/core';
import {LoadingService} from "../loading.service";

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.css']
})
export class LoadingIndicatorComponent {
  isLoading = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
  simulateLoadingCompletion(): void {
    // Simulate an asynchronous operation
    setTimeout(() => {
      this.isLoading = false; // Set to false when loading is complete
    }, 2000); // Simulating a 2-second loading time
  }
}
