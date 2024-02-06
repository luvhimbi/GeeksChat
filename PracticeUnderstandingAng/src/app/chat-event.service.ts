import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatEventService {
  private conversationStartedSource = new Subject<any>();

  conversationStarted$ = this.conversationStartedSource.asObservable();

  triggerConversationStarted(eventData: any) {
    this.conversationStartedSource.next(eventData);
  }

}
