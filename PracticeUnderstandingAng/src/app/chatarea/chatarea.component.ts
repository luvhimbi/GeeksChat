// chatarea.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { MessageRequest } from '../message-request';
import { ConversationResponse } from '../conversation-response';
import {User} from "../User";


@Component({
  selector: 'app-chatarea',
  templateUrl: './chatarea.component.html',
  styleUrls: ['./chatarea.component.css']
})
export class ChatareaComponent implements OnInit {
  @Input() message: MessageRequest | null = null;
  messages: MessageRequest[] = [];
  conversations: ConversationResponse[] = [];
  selectedConversationId: string | null = null;
  currentUser: User = {
    user_id: 101,
    firstname: 'Your',
    lastname: 'Name',
    email: 'your.email@example.com',
    username: 'yourUsername',
    password: 'yourPassword'
  };

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Subscribe to changes in the selected conversation
    this.chatService.selectedConversation$.subscribe(selectedConversation => {
      // Update the selected conversation ID
      this.selectedConversationId = selectedConversation?.conversationId || null;

      // Fetch messages for the selected conversation
      if (this.selectedConversationId) {
       // this.fetchMessages(this.selectedConversationId);
      }
    });

    // Fetch conversations when the component is initialized
    this.fetchConversations();
  }

  fetchMessages(conversationId: number): void {
    // Implement logic to fetch messages based on the selected conversation
    // For demonstration, let's assume you have a method in your service to fetch messages
    this.messages = [
      { conversationId: 1, senderId: 101, receiverId: 102, message: 'Hello there!', timestamp: new Date() },
      { conversationId: 2, senderId: 101, receiverId: 102, message: 'Hello there!', timestamp: new Date() },
      { conversationId: 4, senderId: 101, receiverId: 102, message: 'Hello there!', timestamp: new Date() },
      { conversationId: 5, senderId: 101, receiverId: 102, message: 'Hello there!', timestamp: new Date() }, { conversationId: 1, senderId: 101, receiverId: 102, message: 'Hello there!', timestamp: new Date() }
      // Add more messages as needed
    ].filter(msg => msg.conversationId === conversationId);
  }

  fetchConversations(): void {
    // Implement logic to fetch conversations
    // For demonstration, let's assume you have a method in your service to fetch conversations
    // this.conversations = [
    //   { conversationId: 1, otherUserId: 102, otherUserName: 'Friend', lastMessage: 'Hello', lastMessageTimestamp: '2024-01-25T10:00:00' },
    //
    //   // Add more conversations as needed
    // ];
  }

  hasConversations(): boolean {
    return this.conversations.length > 0;
  }
}
