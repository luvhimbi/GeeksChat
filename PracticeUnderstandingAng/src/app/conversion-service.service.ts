import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConversationResponse } from "./conversation-response";
import { Contact } from "./User";
import { UserService } from "./user.service";
import { StompService } from "./stomp.service";
import {ChatDataService} from "./chat-data.service";


@Injectable({
  providedIn: 'root'
})
export class ConversionServiceService {
  public conversations: ConversationResponse[] = [];
  private contacts: Contact[] = [];

  private conversationsSubject: Subject<ConversationResponse[]> = new Subject<ConversationResponse[]>();

  constructor(private userService: UserService, private webSock: StompService ,
              private chatdataService : ChatDataService) {
    this.getContacts();
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
    const existingConversation = this.findConversationWithUser(otherUser.user_id);

    if (existingConversation) {
      console.log('Conversation already exists:', existingConversation);
      return;
    }


    const conversationId = this.generateConversationId(contact.user.user_id, otherUser.user_id);

    console.log("' fetching");

    console.log("done fectching");

    function shouldPinConversation(user_id: number) {

        // Replace this with your criteria for pinning conversations
        return otherUser.user_id === 1; // Pin conversations where the other user has user_id 1

    }

    const conversation: ConversationResponse = {
      conversationId,
      otherUserId: otherUser.user_id,
      otherUserName: otherUser.username,
      lastMessage: initialMessage,
      lastMessageTimestamp: new Date().toISOString(),
      isPinned: shouldPinConversation(otherUser.user_id), // Set based on your criteria
      isArchived:false

    };

    // Add the new conversation to the list
    this.conversations.push(conversation);

    if(!contact.canChat) {
      this.updateChatPermission(contact.contact_id);
    }
    // Notify observers about the change
    this.conversationsSubject.next([...this.conversations]);

    this.saveConversationsToStorage();

    // Subscribe to the new conversation
    this.webSock.subscribeToConversations([conversation]);

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
    const conversation = this.conversations.find(conversation => conversation.conversationId === conversationId);

    if (conversation) {
      // Update the last message and timestamp
      conversation.lastMessage = newLastMessage;
      conversation.lastMessageTimestamp = new Date().toISOString();

      // Notify observers about the change
      this.conversationsSubject.next([...this.conversations]);
    } else {
      console.error('Conversation not found with ID:', conversationId);
    }
  }

  private findConversationWithUser(userId: number): ConversationResponse | undefined {
    return this.conversations.find(conversation => conversation.otherUserId === userId);
  }

  generateConversationId(user1: number, user2: number): string {
    const sortedUsers = [user1, user2].sort((a, b) => a - b);
    return `${sortedUsers[0]}_${sortedUsers[1]}`;
  }

  saveConversationsToStorage() {
    localStorage.setItem('conversations', JSON.stringify(this.conversations));
  }
  deleteConversation(conversationId: string): void {
    console.log('Deleting conversation with ID:', conversationId)
    // Find the index of the conversation to be deleted
    const conversationIndex = this.conversations.findIndex(conversation => conversation.conversationId === conversationId);

    if (conversationIndex !== -1) {
      // Remove the conversation from the array
      this.conversations.splice(conversationIndex, 1);

      // Notify observers about the change
      this.conversationsSubject.next([...this.conversations]);

      // Save the updated conversations to localStorage
      this.saveConversationsToStorage();
      console.log('After deleting. Conversations:', this.conversations);
    } else {
      console.error('Conversation not found with ID:', conversationId);
    }
  }

  archiveConversation(conversationId: string): void {
    console.log('Archiving conversation with ID:', conversationId);

    // Find the conversation to be archived
    const conversationToArchive = this.conversations.find(conversation => conversation.conversationId === conversationId);

    if (conversationToArchive) {
      // Update the conversation properties for archiving
      conversationToArchive.isArchived = true;

      // Notify observers about the change
      this.conversationsSubject.next([...this.conversations]);

      // Save the updated conversations to localStorage
      this.saveConversationsToStorage();

      console.log('After archiving. Conversations:', this.conversations);
    } else {
      console.error('Conversation not found with ID:', conversationId);
    }
  }
  getArchivedConversations(): ConversationResponse[] {
    return this.conversations.filter(conversation => conversation.isArchived);
  }
}
