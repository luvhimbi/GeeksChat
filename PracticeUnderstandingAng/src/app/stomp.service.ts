import { Injectable } from '@angular/core';
import {Observable, Subject, Subscription, tap} from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {Message} from "stompjs";
import {ConversionServiceService} from "./conversion-service.service";
import {ConversationResponse} from "./conversation-response";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class StompService {
//variables i have
  private socket = new SockJS('http://localhost:8080/stomp-endpoint');
  private stompClient = Stomp.over(this.socket);
  private messagesSubjectMap: Map<string, Subject<MessageDTO>> = new Map();
  private baseUrl = 'http://localhost:8080/api/messages';
// the constructor
  constructor(private http : HttpClient) {

    this.stompClient.debug = null;

    this.stompClient.connect({}, () => {
      console.log('Connected to WebSocket' );

    });
  }

  // how the users chats
  subscribeToConversations(conversations: ConversationResponse[]): void {
   console.log("subscribing " +conversations);
    for (const conversation of conversations) {
      const topic = `/topic/received-message/${conversation.conversationId}`;
      console.log(topic);
      // Create a new subject for each conversation
      const conversationSubject = new Subject<MessageDTO>();
      this.messagesSubjectMap.set(conversation.conversationId, conversationSubject);

      // @ts-ignore
      this.stompClient.subscribe(topic, (message: Message) => {
        const payload: MessageDTO = JSON.parse(message.body);
        console.log("received" + message.body);
        // Notify subscribers of the specific conversation
        conversationSubject.next(payload);
      });
    }
  }

// Update the deleteMessage method in stomp.service.ts


  getMessages(conversationId: string): Observable<MessageDTO> {
    return this.messagesSubjectMap.get(conversationId)!.asObservable();
  }
  togglePinConversation(conversationId: string): Observable<any> {
    const url = `${this.baseUrl}/conversations/${conversationId}/pin`;
    return this.http.put(url, null);
  }
  sendMessage(message: MessageDTO): void {

    console.log("sending part 2" + message.conversation)
    this.stompClient.send(`/app/send-message/${message.conversation}`, {}, JSON.stringify(message));
  }
  getLastMessage(conversationId: string): Observable<string> {
    const url = `${this.baseUrl}/last/${conversationId}`;
    return this.http.get<string>(url);
  }
  getOldMessages(conversationId: string): Observable<MessageDTO[]> {
    const url = `${this.baseUrl}/old/${conversationId}`;
    return this.http.get<MessageDTO[]>(url);
  }
  deleteChat(conversationId: string): Observable<void> {
    const url = `${this.baseUrl}/${conversationId}`;
    return this.http.delete<void>(url);
  }
  fetchAndSubscribeToOldMessages(conversationId: string): void {
    // Assume you have a service to fetch old messages from the database
    this.getOldMessages(conversationId).subscribe(
        (oldMessages: MessageDTO[]) => {
          const conversationSubject = new Subject<MessageDTO>();
          // Create a new subject for the conversation if it doesn't exist
          console.log("old message  " + JSON.stringify(oldMessages));
          if (!this.messagesSubjectMap.has(conversationId)) {

            this.messagesSubjectMap.set(conversationId, conversationSubject);
          }

          // Notify subscribers with old messages
          oldMessages.forEach((message) => {
            this.messagesSubjectMap.get(conversationId)!.next(message);
          });
        },
        (error) => {
          console.error('Error fetching old messages:', error);
        }
    );
  }
}

export interface MessageDTO {
  messageId: number;
  conversation: string;
  sender: number;
  reciever:number;
  message: string;
  timestamp: Date;
}
