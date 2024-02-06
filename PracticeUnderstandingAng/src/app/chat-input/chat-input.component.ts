// chat-input.component.ts

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { StompService } from '../stomp.service';
import { ChatService } from '../chat.service';
import { ConversationResponse } from '../conversation-response';
import {interval, Subscription, takeWhile} from 'rxjs';
import { User } from '../User';
import { UserService } from '../user.service';
import { ConversionServiceService } from '../conversion-service.service';
import {DatePipe} from "@angular/common";
;
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
})
export class ChatInputComponent implements OnInit, OnDestroy {
  message: string = '';
  messagesMap: Map<string, Message[]> = new Map();
  selectedConversation: ConversationResponse | null = null;
  currentUser: User | null = null;
  private subscription: Subscription | undefined;
  unreadMessageCount: number = 0;
  highlightedMessages: Set<Message> = new Set<Message>();
  @ViewChild('chatBox') chatBox: ElementRef | undefined;

  showEmojiLibrary = false;
  message1 = '';

  toggleEmojiLibrary(): void {
    this.showEmojiLibrary = !this.showEmojiLibrary;
  }

  insertEmoji(emoji: string): void {
    this.message1 += emoji;
  }

  constructor(
    private webSocketService: StompService,
    private chatService: ChatService,
    private userService: UserService,
    private conversationService: ConversionServiceService,
    private webSock: StompService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {

    this.chatService.selectedConversation$.subscribe((selectedConversation) => {
      this.selectedConversation = selectedConversation;
      const userFromLocalStorage = localStorage.getItem('userDetails');

      if (userFromLocalStorage) {
        // Parse the JSON string to get the User object
        this.currentUser = JSON.parse(userFromLocalStorage);
      }

      // Unsubscribe from previous subscription
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      if (this.selectedConversation) {
        const conversationId = this.selectedConversation.conversationId;
        this.webSock.fetchAndSubscribeToOldMessages(conversationId);
          // Initialize messages array for the conversation if it doesn't exist
          this.messagesMap.set(conversationId, []);



        this.subscription = this.webSocketService
          .getMessages(conversationId)
          .subscribe((processedMessage: Message) => {
            this.messagesMap.get(conversationId)!.push(processedMessage);

            if (!processedMessage.isSentByUser && !processedMessage.read) {
              this.unreadMessageCount++;
            }
          });
      }
    });


  }

  onDeleteClick(message: Message): void {
    // Handle the 'Delete' action


    // Call the service to delete the message
    this.webSock.deleteMessage(message.messageId).subscribe(
      response => {
        console.log(response); // Log success message
        this.showDeleteSuccessToast(); // Show the success toast
        // Optionally, update your UI to reflect the deletion
      },
      error => {
        console.error('Error deleting message:', error);
        this.showDeleteErrorToast(); // Show the error toast
      }
    );
  }
  private showDeleteErrorToast(): void {
    this.snackBar.open('Failed to delete message', 'Close', {
      duration: 1000,
      panelClass: ['toast-error'],
    });
  }

  private showDeleteSuccessToast(): void {
    this.snackBar.open('Message deleted successfully', 'Close', {
      duration: 1000, // Duration in milliseconds
      panelClass: ['toast-success'], // You can define your own CSS class for styling
    });
  }
  scrollDown(): void {
    if (this.chatBox) {
      const chatBoxElement = this.chatBox.nativeElement;
      chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
    }
  }

  scrollUp(): void {
    if (this.chatBox) {
      const chatBoxElement = this.chatBox.nativeElement;
      chatBoxElement.scrollTop = 0;
    }
  }

  formatTimestamp(timestamp: Date): string {
    if (timestamp) {
      // Example: return this.datePipe.transform(timestamp, 'yyyy-MM-dd HH:mm:ss') || '';
      return this.datePipe.transform(timestamp, 'medium') || ''; // Using the 'medium' format for simplicity
    } else {
      return ''; // Or any default value you want to return for null timestamps
    }
  }

  getFormattedDate(timestamp: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const messageDate = new Date(timestamp);

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    } else if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday';
    } else {
      // If neither today nor yesterday, format the full date
      return this.datePipe.transform(messageDate, 'longDate') || '';
    }
  }

  isCurrentUser(senderId: number): boolean {
    const currentUser = this.userService.getCurrentUserIDFromLocalStorage();
    return senderId === currentUser;
  }

  getMessageBubbleClasses(message: Message): { [key: string]: boolean } {
    const isSentByCurrentUser = message.sender === this.currentUser?.user_id;
    return {
      'sent-message-bubble': isSentByCurrentUser,
      'received-message-bubble': !isSentByCurrentUser,
    };
  }


  sendMessage() {
    const user = this.userService.getCurrentUserIDFromLocalStorage();
    if (user) {
      if (this.message.trim() !== '' && this.selectedConversation) {
        const newMessage: Message = {
          messageId: 0,
          conversation: this.selectedConversation.conversationId,
          sender: user,
          message: this.message,
          timestamp: new Date(),
          isSentByUser: true,
        };
        console.log('Sending message:', newMessage);
        this.webSocketService.sendMessage(newMessage);
        this.conversationService.updateConversation(this.selectedConversation.conversationId, this.message);
        this.message = ''; // Clear the input after sending the message
      }
    }
  }

}

// message.interface.ts

export interface Message {
  messageId: number;
  conversation: string;
  sender: number;
  message: string;
  timestamp: Date;
  isSentByUser?: boolean; // New property to indicate if the message is sent by the user
  read?: boolean;
}
