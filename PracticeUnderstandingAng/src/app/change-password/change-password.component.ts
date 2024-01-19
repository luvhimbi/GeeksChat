import { Component } from '@angular/core';
import {UserService} from "../user.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  username: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  constructor(private authService:UserService,private router: Router) { }
  changePassword(): void {
    this.authService.changePassword(this.username, this.oldPassword, this.newPassword).subscribe(
      response => {
        console.log(response); // Handle success
        Swal.fire({
          title: 'Success!',
          text: 'password successfully changed',
          icon: 'success',
        });
        this.router.navigate(['profile'])
      },
      error => {
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'please enter the right username and old password',
          icon: 'error',
        });
      }
    );
  }
}
