// register.component.ts

import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';  // Import the Router module
import { UserService } from "../user.service";
import { User } from "../User";
import Swal from "sweetalert2";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LoadingService} from "../loading.service";
const passwordValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  const value: string = control.value;
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const isLengthValid = value.length >= 10;

  if (!hasLetter || !hasNumber || !hasSpecialChar || !isLengthValid) {
    return { 'invalidPassword': true };
  }

  return null;
};
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements  OnInit{
  errorMessage: string | null = null;
  user: User = new User();
  userForm!: FormGroup;
  isLoading: boolean = false;
  constructor(private uService: UserService, private router: Router,private formBuilder: FormBuilder,private Loadings:LoadingService) {

  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      password: ['', [Validators.required,passwordValidator]]
    });

    // Patch the values from the user object into the form
    this.userForm.patchValue({
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email,
      username: this.user.username,
      password: this.user.password
    });
  }
  hasError(controlName: string, errorName: string): boolean {
    const control = this.userForm.get(controlName);
    // @ts-ignore
    return control.touched && control.hasError(errorName);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      // Handle form validation errors if needed
      return;
    }
this.Loadings.show();
    // Extract data from the form
    const formData = this.userForm.value;

    // Assign the extracted data to the user object
    this.user.firstname = formData.firstname;
    this.user.lastname = formData.lastname;
    this.user.email = formData.email;
    this.user.username = formData.username;
    this.user.password = formData.password;
    this.Loadings.hide();
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




}
