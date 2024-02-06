// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import your components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import { HomeComponent } from './home/home.component';
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import {AddProfileComponent} from "./add-profile/add-profile.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ChatlistComponent} from "./chatlist/chatlist.component";
import {AuthGuard} from "./auth.guard";
import {EditUserDetailsComponent} from "./edit-user-details/edit-user-details.component";
import {ContactsComponent} from "./contacts/contacts.component";
import {ArchivedChatsComponent} from "./archived-chats/archived-chats.component";


// Define your routes
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  {path:'chat',component:ChatlistComponent},
  {path:'registeredUsers',component:RegisteredUsersComponent},
  {path:'reset-password',component:ForgetPasswordComponent},
  {path:'profile',component:AddProfileComponent},
  {path:'change-password',component:ChangePasswordComponent},
  {path:'edit',component:EditUserDetailsComponent},
  {path:'contacts',component:ContactsComponent},
  {path:'Archive',component:ArchivedChatsComponent}
 // { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
