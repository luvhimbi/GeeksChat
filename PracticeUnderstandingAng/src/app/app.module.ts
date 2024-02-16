import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisteredUsersComponent } from './registered-users/registered-users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import { ChatlistComponent } from './chatlist/chatlist.component';
import { ChatareaComponent } from './chatarea/chatarea.component';
import { ChatheaderComponent } from './chatheader/chatheader.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ContactsComponent } from './contacts/contacts.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { NoconversationComponent } from './noconversation/noconversation.component';
import { DatePipe } from '@angular/common';
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {NgbModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {MatMenuModule} from "@angular/material/menu";
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { GroupChatComponent } from './group-chat/group-chat.component';
import { EditUsernameDialogComponentComponent } from './edit-username-dialog-component/edit-username-dialog-component.component';
import { ForgetpasswordPageComponent } from './forgetpassword-page/forgetpassword-page.component';
import { VerificationCodeComponent } from './verification-code/verification-code.component';
import { TodoCreateComponent } from './todo-create/todo-create.component';
import { CreateTaskDialogComponent } from './create-task-dialog/create-task-dialog.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    RegisteredUsersComponent,
    HomeComponent,
    PageNotFoundComponent,
    SideNavbarComponent,
    ChatlistComponent,
    ChatareaComponent,
    ChatheaderComponent,
    ForgetPasswordComponent,
    AddProfileComponent,
    ChangePasswordComponent,
    EditUserDetailsComponent,
    ChatInputComponent,
    ContactsComponent,
    UserModalComponent,
    NoconversationComponent,

    ProfileDialogComponent,
    GroupChatComponent,
    EditUsernameDialogComponentComponent,
    ForgetpasswordPageComponent,
    VerificationCodeComponent,
    TodoCreateComponent,
    CreateTaskDialogComponent,
    LoadingIndicatorComponent



  ],
  imports: [
    NgbToastModule,
    PickerModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, MatIconModule, MatInputModule, PickerComponent, NgbModule, MatMenuModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
