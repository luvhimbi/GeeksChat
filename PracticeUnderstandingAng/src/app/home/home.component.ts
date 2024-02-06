import { Component, OnInit } from '@angular/core';
import { User } from "../User";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { ConversationResponse } from "../conversation-response"; // Import the ConversationResponse model
import { ConversionServiceService } from "../conversion-service.service"; // Import the service responsible for conversations

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  logoutMessage: string = '';
  currentUser: User = {
    user_id: 0,
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: ''
  };
  conversations: ConversationResponse[] = []; // Add this line to initialize the conversations array

  constructor(
      private uService: UserService,
      private router: Router,
      private conversationService: ConversionServiceService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('userDetails');


  }

  onUserLogout() {
    localStorage.removeItem('userDetails');
    this.router.navigate(['login'], { queryParams: { logoutMessage: 'Logout successful. Redirecting to login page...' } });
  }


}
