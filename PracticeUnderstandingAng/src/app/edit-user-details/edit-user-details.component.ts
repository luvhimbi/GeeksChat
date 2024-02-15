import { Component, OnInit } from '@angular/core';
import { User } from "../User";
import { UserService } from "../user.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {EmojiEvent} from "@ctrl/ngx-emoji-mart/ngx-emoji";
@Component({
  selector: 'app-edit-user-details',
  templateUrl: './edit-user-details.component.html',
  styleUrls: ['./edit-user-details.component.css']
})
export class EditUserDetailsComponent implements OnInit {

  user: User | undefined;

  constructor(private userService: UserService,private router:Router) { }

  ngOnInit(): void {
    // Retrieve user data from local storage
    const storedUserData = localStorage.getItem('userDetails');

    // If user data is present in local storage, parse and assign it
    if (storedUserData) {
      this.user = JSON.parse(storedUserData);
    }
  }



  updateUserDetails(): void {
    // Check if user is defined before accessing user_id
    if (this.user) {
      this.userService.updateUserDetails(this.user.user_id, this.user).subscribe(updatedUser => {
        this.user = updatedUser;
        // Update user data in local storage
        localStorage.setItem('userDetails', JSON.stringify(updatedUser));
        Swal.fire({
          title: 'Success!',
          text: 'password successfully changed',
          icon: 'success',
        });
        this.router.navigate(['profile'])
      });
    } else {
      console.error('User data is undefined.');

    }
  }
}
