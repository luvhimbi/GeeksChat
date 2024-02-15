// verification-code.component.ts

import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css']
})
export class VerificationCodeComponent {
  verificationForm: FormGroup;
  correctResetCode: number | undefined;
  enteredCode:number|undefined

  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.verificationForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });

    // Retrieve reset code and email from localStorage
    this.correctResetCode = Number(localStorage.getItem('resetCode'));
    console.log(this.correctResetCode)

  }

  submitVerificationCode(): void {
    // Check if the entered code matches the correct reset code
    if (this.enteredCode === this.correctResetCode) {
      // Redirect to the page where the user can set a new password
      this.router.navigate(['/set-new-password']);
    } else {
      // Display an error message if the code is invalid
      Swal.fire({
        title: 'Error!',
        text: 'Invalid verification code. Please try again.',
        icon: 'error',
      });
    }
  }
}
