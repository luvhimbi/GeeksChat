import { Component } from '@angular/core';
import {Contact, User} from "../User";
import {UserService} from "../user.service";
import Swal from "sweetalert2";


@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.css']
})
export class RegisteredUsersComponent {
  users: User[] = [];
  searchTerm: string = '';
  selectedUser: User | null = null;
  scrolled = false;

  constructor(private userService: UserService) {
  }


  ngOnInit(): void {
    this.userService.getAllUsersExceptCurrentUser().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  get reversedUsers(): User[] {
    // Return the reversed array of users
    return this.users.slice().reverse();
  }

  get filteredUsers(): User[] {
    // Filter users based on the search term
    return this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onScroll(event: any): void {
    // Check if the user has scrolled down
    this.scrolled = event.target.scrollTop > 0;
  }


  addToContact(user:User) {
    // Retrieve the current user ID from local storage
    const currentUserID = this.getCurrentUserIDFromLocalStorage();
    console.log(currentUserID)
    if (currentUserID !== null) {
      // Check if this.selectedUser is defined
        const contactedUserId = user.user_id;
        console.log(contactedUserId);

        this.userService.addContact(currentUserID, contactedUserId).subscribe(
          (response: Contact) => {
            console.log('Contact added successfully:', response);
            Swal.fire({
              title: 'New contact added',
              text: 'contact added successfully',
              icon: 'success',
            });
          },
          (error) => {
            console.error('Error adding contact:', error);
          }
        );

    } else {
      console.error('Current user ID not found in local storage');
    }
  }



  private getCurrentUserIDFromLocalStorage(): number | null {
    const storedUser = localStorage.getItem('userDetails');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.user_id;
    } else {
      return null;
    }
  }
  startChat(user: User) {

  }

  selectUser(user: User) {
    this.selectedUser = user;
  }
}
