// forget-password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../login.service";
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import { SharedServiceService } from "../Services/SharedService/shared-service.service";


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;
  errorMessage: string | null = null;
  resetCode: number | undefined;

  constructor(private formBuilder: FormBuilder, private forgetPasswordService: LoginService, private router: Router, private sharedService: SharedServiceService) {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  initiatePasswordReset(): void {
    this.errorMessage = null;
    console.log(this.forgetPasswordForm.get('email'))
    if (this.forgetPasswordForm.valid) {
      const userEmail = this.forgetPasswordForm.get('email')?.value;


      // Call the service to send the email to the backend
      this.forgetPasswordService.initiatePasswordReset('' + userEmail).subscribe(
        (code: number) => {

          // Add any further logic here based on the reset code
          Swal.fire({
            title: 'Success!',
            text: 'An email has been sent with a reset code. Check your email for instructions.',
            icon: 'success',
          });

          this.router.navigate(['verificationCode']);

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
