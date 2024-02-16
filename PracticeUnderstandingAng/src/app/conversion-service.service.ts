import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {Conversation, ConversationResponse} from "./conversation-response";
import { Contact } from "./User";
import { UserService } from "./user.service";
import { StompService } from "./stomp.service";
import {ChatDataService} from "./chat-data.service";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ConversionServiceService {
  private baseUrl = 'http://localhost:8080/api/conversations';
  public conversations: ConversationResponse[] = [];
  private contacts: Contact[] = [];

  private conversationsSubject: Subject<ConversationResponse[]> = new Subject<ConversationResponse[]>();

  constructor(private userService: UserService, private webSock: StompService ,
              private chatdataService : ChatDataService,
              private http : HttpClient) {
    this.getContacts();
  }

  createConversationRoom(conversation: Conversation): Observable<Conversation> {
    console.log("conversations " + conversation);

    return this.http.post<Conversation>(`${this.baseUrl}/create`, conversation);
  }

  getContacts() {
    const currentUserID = this.userService.getCurrentUserIDFromLocalStorage();

    if (currentUserID !== null) {
      this.userService.getAllContacts(currentUserID).subscribe(
          (contacts: Contact[]) => {
            this.contacts = contacts;


            setTimeout(() => {

              this.createConversationsWithChatPermission(); // Call your method inside the setTimeout callback
            }, 100);
          },
          (error) => {
            console.error('Error fetching contacts:', error);
          }
      );
    } else {
      console.error('Current user ID not found in local storage');
    }
  }

  fetchConversations(): Observable<ConversationResponse[]> {
    return this.conversationsSubject.asObservable();
  }

    createConversationsWithChatPermission(): void {

    const contactsWithChatPermission = this.contacts.filter(contact => contact.canChat === true);

    contactsWithChatPermission.forEach(contact => {
      const existingConversation = this.findConversationWithUser(contact.contactedUser.user_id);

      if (!existingConversation) {
        // If conversation doesn't exist, create one
        this.createConversation(contact, "");
      }
    });
  }

  createConversation(contact: Contact, initialMessage: string): void {

    console.log('Creating conversation: ', contact.contactedUser);
    const otherUser = contact.contactedUser;
    let conv : Conversation = {
      conversationId: "",
      user1 : contact.user.user_id,
      user2 : contact.contactedUser.user_id
    };

    this.createConversationRoom(conv);
    const existingConversation = this.findConversationWithUser(otherUser.user_id);

    if (existingConversation) {
      console.log('Conversation already exists:', existingConversation);
      return;
    }


    const conversationId = this.generateConversationId(contact.user.user_id, otherUser.user_id);

    const conversation: ConversationResponse = {
      conversationId,
      otherUserId: otherUser.user_id,
      otherUserName: otherUser.username,
      lastMessage: initialMessage,
      lastMessageTimestamp: new Date().toISOString(),
      isPinned: false, // Set based on your criteria
      isArchived:false

    };

    // Add the new conversation to the list
    this.conversations.push(conversation);

    if(!contact.canChat) {
      this.updateChatPermission(contact.contact_id);
    }
    // Notify observers about the change
    this.conversationsSubject.next([...this.conversations]);



    // Subscribe to the new conversation
    this.webSock.subscribeToConversations([conversation]);

  }
  deleteConversation(conversationId: string): void {
    const index = this.conversations.findIndex(conv => conv.conversationId === conversationId);

    if (index !== -1) {
      // Remove the conversation from the array
      this.conversations.splice(index, 1);

      // Notify observers about the change
      this.conversationsSubject.next([...this.conversations]);

      // Add logic to unsubscribe or handle other cleanup tasks if needed
      // ...

      console.log(`Conversation with ID ${conversationId} deleted.`);
    } else {
      console.warn(`Conversation with ID ${conversationId} not found.`);
    }
  }

  updateChatPermission(contactId : any) {

    this.chatdataService.allowChat(contactId).subscribe(
        (response) => {
          console.log('Chat permission updated successfully:', response);
        },
        (error) => {
          console.error('Error updating chat permission:', error);
        }
    );
  }

  updateConversation(conversationId: string, newLastMessage: string): void {
    // Update the last message and timestamp in the local conversation
    const conversation = this.conversations.find(conversation => conversation.conversationId === conversationId);

    if (conversation) {
      conversation.lastMessage = newLastMessage;
      conversation.lastMessageTimestamp = new Date().toISOString();

      // Notify observers about the change
      this.conversationsSubject.next([...this.conversations]);

      // Now, fetch the actual last message from the backend
      this.webSock.getLastMessage(conversationId).subscribe(
        (lastMessageFromBackend: string) => {
          // Update the local conversation with the actual last message from the backend
          conversation.lastMessage = lastMessageFromBackend;
            console.log(lastMessageFromBackend)
          // Notify observers again after updating with the actual last message
          this.conversationsSubject.next([...this.conversations]);
        },
        error => {
          console.error('Error fetching last message:', error);
        }
      );
    } else {
      console.error('Conversation not found with ID:', conversationId);
    }
  }
  private findConversationWithUser(userId: number): ConversationResponse | undefined {
    return this.conversations.find(conversation => conversation.otherUserId === userId);
  }

  generateConversationId(user1: number, user2: number): string {
    const sortedUsers = [user1, user2].sort((a, b) => a - b);
    return `${sortedUsers[0]}${sortedUsers[1]}`;
  }






}
