import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ConversationResponse} from "./conversation-response";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private selectedConversationSubject = new BehaviorSubject<ConversationResponse | null>(null);
  public selectedConversation$: Observable<ConversationResponse | null> = this.selectedConversationSubject.asObservable();

  setSelectedConversation(conversation: ConversationResponse): void {
    console.log(conversation);
    this.selectedConversationSubject.next(conversation);
  }


}
