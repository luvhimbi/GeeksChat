import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Contact, User } from './User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user';
  private apiUrl2 = 'http://localhost:8080/api';

  selectedUser: string = '';
  registeredUsers?: User[];
  private onlineStatusMap: Map<number, boolean> = new Map<number, boolean>();

  constructor(private http: HttpClient) {}

  // Registration method
  register(userDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userDetails).pipe(
      catchError((error: any) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  // Retrieve user by ID
  getUserById(userId: number): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}`;
    return this.http.get(url);
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Change user password
  changePassword(username: string, oldPassword: string, newPassword: string): Observable<any> {
    const request = { username, oldPassword, newPassword };
    return this.http.put<any>(`${this.apiUrl}/change-password`, request);
  }

  // Get all users except the current user
  getAllUsersExceptCurrentUser(): Observable<User[]> {
    const currentUser = this.currentUser();
    return this.http.get<User[]>(`${this.apiUrl}/except/${currentUser.user_id}`);
  }

  // Update user details
  updateUserDetails(userId: number, updatedUser: User | undefined): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, updatedUser);
  }

  // Update online status
  updateOnlineStatus(userId: number, online: boolean): void {
    this.onlineStatusMap.set(userId, online);
    console.log(`Online status updated for user ${userId}: ${online}`);
  }

  // Get online status
  getOnlineStatus(userId: number): boolean {
    return this.onlineStatusMap.get(userId) || false;
  }

  // Get current user from local storage
  currentUser(): User {
    return JSON.parse(localStorage.getItem('userDetails') || '{}');
  }

  // Add a user as a contact
  addContact(user_id: number, contactedUserId: number | undefined): Observable<Contact> {
    const body = contactedUserId !== undefined ? { user_id, contactedUserId } : { user_id };
    return this.http.post<Contact>(`${this.apiUrl}/add`, body);
  }

  // Get all contacts for a user
  getAllContacts(userId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/all/${userId}`);
  }
  verifyResetCode(enteredCode: number): Observable<boolean> {
    // Assuming you have an endpoint on your backend to verify the reset code
    const verificationEndpoint = `${this.apiUrl}/verify-reset-code`;

    // Send a POST request to the backend with the entered code
    return this.http.post<boolean>(verificationEndpoint, { enteredCode });
  }


  // Set selected user
  setSelectedUser(username: string) {
    this.selectedUser = username;
  }

  // Add a task
  addTask(task: any): Observable<any> {
    const userId = this.getCurrentUserIDFromLocalStorage();
    const apiUrlWithUserId = `${this.apiUrl2}/createTodo/${userId}`;
    return this.http.post<any>(apiUrlWithUserId, task);
  }

  // Get all tasks for a user
  getAllTasksForUser(): Observable<any[]> {
    const userId = this.getCurrentUserIDFromLocalStorage();
    const apiUrlWithUserId = `${this.apiUrl2}/tasks/${userId}`;
    return this.http.get<any[]>(apiUrlWithUserId);
  }

  // Update completion status of a task
  updateCompletionStatus(userId: number | null, taskId: number, completed: boolean): Observable<any> {
    const apiUrlWithUserIdAndTaskId = `${this.apiUrl2}/updateCompletionStatus/${userId}/${taskId}`;
    return this.http.put(apiUrlWithUserIdAndTaskId, { completed });
  }

  // Delete a task
  deleteTask(userId: number, taskId: number): Observable<any> {
    const apiUrlWithUserIdAndTaskId = `${this.apiUrl2}/deleteTask/${userId}/${taskId}`;
    return this.http.delete(apiUrlWithUserIdAndTaskId);
  }

  // Get current user ID from local storage
  getCurrentUserIDFromLocalStorage(): number | null {
    const storedUser = localStorage.getItem('userDetails');
    return storedUser ? JSON.parse(storedUser).user_id : null;
  }
}
