import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Variables to store login form data
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  logoutMessage: string | null = null;

  ngOnInit(): void {
    // Check for query parameter
    this.route.queryParams.subscribe((params) => {
      const logoutMessage = params['logoutMessage'] || null;

      // If a logout message exists, set a timer to clear it after 20 seconds
      if (logoutMessage) {
        this.logoutMessage = logoutMessage;

        setTimeout(() => {
          this.logoutMessage = null;
        }, 20000); // 20 seconds
      }
    });
  }

  constructor(private authService: LoginService, private router: Router, private route: ActivatedRoute) {
    if (localStorage.getItem('userDetails') !== null) {
      this.router.navigate(['/home']);
    }
  }

  // Method to handle login form submission
  onLogin(): void {
    this.errorMessage = null; // Reset error message on each submission

    // Validate and send login request
    if (this.email && this.password) {
      this.authService.login(this.email, this.password)
        .subscribe(
          (response) => {
            console.log('Login successful:', response);
            localStorage.setItem('userDetails', JSON.stringify(response));
            // Redirect to home page upon successful login
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error during login:', error);

            if (error.status === 401) {
              Swal.fire({
                title: 'Error!',
                text: 'Invalid email or password',
                icon: 'error',
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'An error occurred. Please try again.',
                icon: 'error',
              });
            }
          }
        );
    } else {

      Swal.fire({
        title:'Error!',
        text:'Please enter both email and password',
        icon:'error',
      });
    }
  }
}
