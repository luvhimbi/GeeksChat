// register.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Import the Router module
import { UserService } from "../user.service";
import { User } from "../User";
import Swal from "sweetalert2";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMessage: string | null = null;
  user: User = new User();

  constructor(private uService: UserService, private router: Router) {
  }

  onSubmit(): void {
    this.uService.register(this.user).subscribe(
      (response) => {
        console.log('Registration successful!', response);
        Swal.fire({
          title: 'Welcome to GeeksChat!',
          text: 'registration completed please login',
          icon: 'success',
        });
        this.router.navigate(['login']); // Navigate to the login page on successful registration
      },
      (error) => {
        if (error.status === 400 && error.error && typeof error.error === 'string' && error.error.includes('Email already exists')) {
          this.errorMessage = error.error;
        } else {
          // Display a generic error message for other types of errors
          this.errorMessage = 'An error occurred. Please try again.';
        }
      }
    );
  }
  private extractValidationErrorMessage(errors: any): string {
    // Assuming the errors object is in the format { field: errorMessage }
    const field = Object.keys(errors)[0];
    const errorMessage = errors[field];
    return `${field} ${errorMessage}`;
  }
}
