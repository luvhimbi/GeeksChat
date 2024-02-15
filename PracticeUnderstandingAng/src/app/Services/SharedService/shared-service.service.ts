import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private resetEmail: string | null = null;

  setResetEmail(email: string): void {
    this.resetEmail = email;
  }

  getResetEmail(): string | null {
    return this.resetEmail;
  }
}
