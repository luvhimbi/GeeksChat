import {Component, OnInit} from '@angular/core';
import {User} from "../User";
import {UserService} from "../user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  logoutMessage: string = '';
  currentUser: User = {

    user_id:0,
  firstname:'',
  lastname:'',
  email:'',
  username:'',
    password:''
  };
  constructor(private uService: UserService, private router: Router) {
  }
  ngOnInit(): void {
    const storedUser = localStorage.getItem('userDetails');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  onUserLogout() {
    localStorage.removeItem('userDetails');
    this.router.navigate(['login'], { queryParams: { logoutMessage: 'Logout successful. Redirecting to login page...' } });
  }
}
