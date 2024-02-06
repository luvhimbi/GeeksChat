import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChatDataService {

  private baseUrl = "http://localhost:8080/api"; // replace with your actual backend base URL

  constructor(private http: HttpClient) {}
  private lastMessagesMapSource = new BehaviorSubject<Map<string, string[]>>(new Map());
  lastMessagesMap$ = this.lastMessagesMapSource.asObservable();

  updateLastMessagesMap(lastMessagesMap: Map<string, string[]>): void {
    this.lastMessagesMapSource.next(lastMessagesMap);
  }

  public allowChat(contactId: number): Observable<string> {
    const url = `${this.baseUrl}/contacts/${contactId}/allowChat`;
    return this.http.put<string>(url, {});
  }

}
