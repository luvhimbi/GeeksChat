import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import 'bootstrap';
import { User } from '../User';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent {
  logoutMessage: string = '';
  currentUser: User = {
    user_id: 0,
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: ''
  };

  constructor(private uService: UserService, private router: Router) {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isRegisterPage(): boolean {
    return this.router.url === '/register';
  }
  ngOnInit(): void {
    const storedUser = localStorage.getItem('userDetails');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  onUserLogout(): void {
    Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with logout
        localStorage.removeItem('userDetails');
        this.router.navigate(['login'], { queryParams: { logoutMessage: 'Logout successful. Redirecting to login page...' } });
      }
    });
  }
}
