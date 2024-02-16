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
import {EmojiEvent} from "@ctrl/ngx-emoji-mart/ngx-emoji";
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

  public isEmojiPickerVisible: boolean = false;
  selectedEmojis: string[] = [];
  @ViewChild('chatBox') chatBox: ElementRef | undefined;




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
  public toggleEmojiPicker() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }
  public addEmoji(event: EmojiEvent) {
    this.message = `${this.message}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
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
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }



  isDifferentDay(message1: Message, message2: Message): boolean {
    const date1 = new Date(message1.timestamp);
    const date2 = new Date(message2.timestamp);

    // Compare only the date parts (day, month, and year)
    return (
      date1.getDate() !== date2.getDate() ||
      date1.getMonth() !== date2.getMonth() ||
      date1.getFullYear() !== date2.getFullYear()
    );
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
      return this.datePipe.transform(messageDate, 'EEEE, MMMM d') || '';
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
          reciever:this.selectedConversation.otherUserId,
          message: this.message,
          timestamp: new Date(),
          isSentByUser: true,
        };
        console.log('Sending message:', newMessage);
        this.webSocketService.sendMessage(newMessage);
        const conversationId = this.selectedConversation!.conversationId;
        this.messagesMap.get(conversationId)!.push(newMessage);
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
  reciever:number;
  message: string;
  timestamp: Date;
  isSentByUser?: boolean; // New property to indicate if the message is sent by the user
  read?: boolean;
}
