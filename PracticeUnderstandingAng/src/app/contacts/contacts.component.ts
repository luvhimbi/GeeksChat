// contacts.component.ts
import { Component, OnInit } from '@angular/core';
import { Contact } from '../User';
import { UserService } from '../user.service';
import {MatDialog} from "@angular/material/dialog";
import {UserModalComponent} from "../user-modal/user-modal.component";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService,public dialog: MatDialog) {}

  ngOnInit(): void {
    // Fetch the list of contacts from the service
    const currentUserID = this.getCurrentUserIDFromLocalStorage();
   console.log(currentUserID);
    if (currentUserID !== null) {
      this.userService.getAllContacts(currentUserID).subscribe(
        (contacts: Contact[]) => {
          console.log('Contacts:', contacts);
          this.contacts = contacts;
          this.filteredContacts = contacts;

        },
        (error) => {
          console.error('Error fetching contacts:', error);
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

  // Function to filter contacts based on the search term
  filterContacts(): void {
    this.filteredContacts = this.contacts.filter(contact =>
      contact.contactedUser.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openUserModal(contact: Contact): void {
    this.dialog.open(UserModalComponent, {
      width: '500px', // Set the desired width
      data: contact // Pass the contact data to the modal
    });
  }
  startChat(contact: Contact) {

  }


}
