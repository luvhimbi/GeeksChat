import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../login.service";
import Swal from 'sweetalert2';
import {Router} from "@angular/router";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private forgetPasswordService: LoginService,private router: Router) {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  initiatePasswordReset(): void {
    this.errorMessage = null;
    if (this.forgetPasswordForm.valid) {
      const userEmail = this.forgetPasswordForm.get('email')?.value;
      console.log(userEmail);

      // Call the service to send the email to the backend
      this.forgetPasswordService.initiatePasswordReset('' + userEmail).subscribe(
        response => {
          console.log('Reset email sent successfully:', response);
          // Add any further logic here based on the backend response
          Swal.fire({
            title: 'Success!',
            text: 'Password reseted successfully .please check your email for new password',
            icon: 'success',
          });
          this.router.navigate(['login']);

        },
        error => {
          console.error('Error sending reset email:', error);

          if (error.status === 404) {
            // Use SweetAlert2 for error message
            Swal.fire({
              title: 'Error!',
              text: 'User not found.',
              icon: 'error',
            });
          } else {
            // Use SweetAlert2 for general error message
            Swal.fire({
              title: 'Error!',
              text: 'Failed to initiate password reset. Please try again later.',
              icon: 'error',
            });
          }
        }
      );
    }
  }
}
