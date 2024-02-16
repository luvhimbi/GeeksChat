// verification-code.component.ts

import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import {UserService} from "../user.service";

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css']
})
export class VerificationCodeComponent {
  verificationForm: FormGroup;
  correctResetCode: number | undefined;
  enteredCode:number|undefined

  constructor(private router: Router, private formBuilder: FormBuilder,private userService:UserService) {
    this.verificationForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });

    // Retrieve reset code and email from localStorage
    this.correctResetCode = Number(localStorage.getItem('resetCode'));
    console.log(this.correctResetCode)

  }

  submitVerificationCode(): void {
    if (this.verificationForm.valid) {
      const enteredCode = this.verificationForm.get('code')?.value;
   console.log(enteredCode)
      // Use the service method to verify the reset code
      this.userService.verifyResetCode(enteredCode).subscribe(
        (isValid) => {
          if (isValid) {
            Swal.fire({
              title: 'Success!',
              text: 'Verification successful. Redirecting...',
              icon: 'success',
            }).then(() => {
              // Redirect logic here
              this.router.navigate(["forgetpassword"])
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Invalid verification code. Please try again.',
              icon: 'error',
            });
          }
        },
        (error) => {
          console.error('Error verifying reset code:', error);
          // Handle the error as needed
        }
      );
    }
  }
}
