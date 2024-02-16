// forgetpassword-page.component.ts

import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgetpassword-page',
  templateUrl: './forgetpassword-page.component.html',
  styleUrls: ['./forgetpassword-page.component.css'],
})
export class ForgetpasswordPageComponent implements OnInit {
  newPassword!: string;
  confirmPassword!: string;
  passwordResetForm: FormGroup;

  constructor(private loginService: LoginService, private formBuilder: FormBuilder) {
    // Retrieve email from localStorage
    this.passwordResetForm = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(10), this.passwordCriteriaValidator]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  ngOnInit(): void {}

  private passwordsMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;

    // Check if passwords match
    const passwordsMatch = newPassword === confirmPassword;

    return passwordsMatch ? null : { passwordsNotMatch: true };
  }

  private passwordCriteriaValidator(control: any) {
    const password = control.value;

    // Check if the password meets the specified criteria (combination of letters, numbers, and special characters)
    const passwordValid =
      /[a-zA-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return passwordValid ? null : { passwordInvalid: true };
  }

  resetPassword(): void {
    // Check if newPassword and confirmPassword match
    if (this.newPassword === this.confirmPassword) {
      // Call your login service to update the password
      this.loginService.updatePassword(this.newPassword).subscribe(
        (response) => {
          // Handle success (e.g., show success message)
          console.log('Password reset successful:', response);

          // Use SweetAlert2 for success message
          Swal.fire({
            title: 'Success!',
            text: 'Password reset successful',
            icon: 'success',
          });
        },
        (error) => {
          // Handle error (e.g., show error message)
          console.error('Password reset failed:', error);

          // Use SweetAlert2 for error message
          Swal.fire({
            title: 'Error!',
            text: 'Failed to reset password. Please try again later.',
            icon: 'error',
          });
        }
      );
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
