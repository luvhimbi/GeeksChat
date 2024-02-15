// forgetpassword-page.component.ts

import { Component } from '@angular/core';
import { LoginService } from "../login.service";
import { SharedServiceService } from "../Services/SharedService/shared-service.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgetpassword-page',
  templateUrl: './forgetpassword-page.component.html',
  styleUrls: ['./forgetpassword-page.component.css']
})
export class ForgetpasswordPageComponent {
  email: string;
  newPassword: string;
  confirmPassword: string;

  constructor(private loginService: LoginService) {
    // Retrieve email from localStorage
    this.email ='';


    this.newPassword = '';
    this.confirmPassword = '';
  }

  resetPassword(): void {
    // Check if newPassword and confirmPassword match
    if (this.newPassword === this.confirmPassword) {
      // @ts-ignore

      // Call your login service to update the password
      this.loginService.updatePassword(this.email, this.newPassword)
        .subscribe(response => {
          // Handle success (e.g., show success message)
          console.log('Password reset successful:', response);

          // Use SweetAlert2 for success message
          Swal.fire({
            title: 'Success!',
            text: 'Password reset successful',
            icon: 'success',
          });
        }, error => {
          // Handle error (e.g., show error message)
          console.error('Password reset failed:', error);

          // Use SweetAlert2 for error message
          Swal.fire({
            title: 'Error!',
            text: 'Failed to reset password. Please try again later.',
            icon: 'error',
          });
        });
    } else {
      // Passwords don't match, handle accordingly (e.g., display error message)
      console.error('Passwords do not match');

      // Use SweetAlert2 for error message
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match',
        icon: 'error',
      });
    }
  }
}
