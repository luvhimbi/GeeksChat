import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import {Contact, User} from "./User";
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user';
   selectedUser : string = "";
   registeredUsers?:User[]
  private onlineStatusMap: Map<number, boolean> = new Map<number, boolean>();
  constructor(private http: HttpClient) { }

  register(userDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userDetails).pipe(
      catchError((error: any) => {
        // Handle the error here
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  changePassword(username: string, oldPassword: string, newPassword: string): Observable<any> {
    const request = { username, oldPassword, newPassword };
    return this.http.put<any>(`${this.apiUrl}/change-password`, request);
  }

  getAllUsersExceptCurrentUser(): Observable<User[]> {
    const currentUser = this.currentUser();

    return this.http.get<User[]>(`${this.apiUrl}/except/${currentUser.user_id}`);
  }


  updateUserDetails(userId: number, updatedUser: User | undefined): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, updatedUser);
  }
  updateOnlineStatus(userId: number, online: boolean): void {
    this.onlineStatusMap.set(userId, online);
    console.log(`Online status updated for user ${userId}: ${online}`);
  }
  getOnlineStatus(userId: number): boolean {
    return this.onlineStatusMap.get(userId) || false;
  }
  currentUser(): User {
    return JSON.parse(localStorage.getItem('userDetails') || '{}');
  }


  //method to add a user as a contact
  addContact(user_id: number, contactedUserId: number | undefined): Observable<Contact> {
    // Omit contactedUserId from the body if it's undefined
    const body = contactedUserId !== undefined ? { user_id, contactedUserId } : { user_id };

    return this.http.post<Contact>(`${this.apiUrl}/add`, body);
  }


  // Method to get all contacts for a user
  getAllContacts(userId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/all?userId=${userId}`);
  }
  setSelectedUser(username : string){
    this.selectedUser = username;
  }

  getCurrentUserIDFromLocalStorage(): number | null {
    const storedUser = localStorage.getItem('userDetails');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.user_id;
    } else {
      return null;
    }
  }

}
