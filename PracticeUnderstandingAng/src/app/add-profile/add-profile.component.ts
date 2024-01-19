import { Component } from '@angular/core';
import {LoginService} from "../login.service";
import {UserService} from "../user.service";

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.css']
})
export class AddProfileComponent {
  userProfile: any;

  constructor(private authService:UserService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const storedProfile = localStorage.getItem('userDetails');
    if (storedProfile) {
      this.userProfile = JSON.parse(storedProfile);
    } else {
      // Handle the case where the user profile is not found in local storage
      console.error('User profile not found in local storage');
    }
  }


}
