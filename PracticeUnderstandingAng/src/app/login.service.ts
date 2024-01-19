// login.service.ts (and other services)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient, private loadingService: LoadingService) {}

  login(email: string, password: string): Observable<any> {
    this.loadingService.showLoader(); // Show loading spinner

    const loginUrl = `${this.apiUrl}/login`;
    const body = { email, password };

    return this.http.post(loginUrl, body)
      .pipe(
        finalize(() => this.loadingService.hideLoader()) // Hide loading spinner on success or error
      );
  }
  isAuthenticated(): boolean {
    // Example: Check if the user is logged in
    return localStorage.getItem('user') !== null;
  }

  initiatePasswordReset(email: string): Observable<any> {
    const resetUrl = `${this.apiUrl}/reset`;



    return this.http.post(resetUrl, email);
  }

}
