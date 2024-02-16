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


    const loginUrl = `${this.apiUrl}/login`;
    const body = { email, password };

    return this.http.post(loginUrl, body)
     ;
  }
  isAuthenticated(): boolean {
    // Example: Check if the user is logged in
    return localStorage.getItem('user') !== null;
  }

  initiatePasswordReset(email: string): Observable<any> {
    const resetUrl = `${this.apiUrl}/reset`;



    return this.http.post(resetUrl, email);
  }
  updatePassword( newPassword: string): Observable<any> {
    const updatePasswordUrl = `${this.apiUrl}/update-password`;


    // @ts-ignore
    return this.http.post(updatePasswordUrl);
  }

}
