import { Component } from '@angular/core';
import {UserService} from "../user.service";

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent {

  username = "";

  constructor( private userservice : UserService) {
  }
  onSelect(username : string) {
    console.log("clicking");
    this.userservice.setSelectedUser(this.username);
  }
}
