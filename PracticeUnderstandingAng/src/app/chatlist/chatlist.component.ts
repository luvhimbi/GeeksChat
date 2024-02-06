import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { ConversationResponse } from "../conversation-response";
import { ConversionServiceService } from "../conversion-service.service";
import { ChatService } from "../chat.service";
import { NgbDropdown } from "@ng-bootstrap/ng-bootstrap";
import { ProfileDialogComponent } from "../profile-dialog/profile-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { User } from "../User";
import {Subject} from "rxjs";

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent implements OnInit {

  conversations: ConversationResponse[] = [];
  selectedConversation: ConversationResponse | null = null;
  conversationsSubject: Subject<ConversationResponse[]> = new Subject<ConversationResponse[]>(); // Add this line
  constructor(
      private conversationService: ConversionServiceService,
      private chatService: ChatService,
      private cdr: ChangeDetectorRef,
      private dialog: MatDialog
  ) {
    this.loadConversationsFromStorage();
  }

  ngOnInit(): void {

    console.log('ngOnInit called');
    // Fetch conversations only if not already fetched
    if (!this.conversations || this.conversations.length === 0) {
      this.conversationService.fetchConversations().subscribe(updatedConversations => {
        this.conversations = updatedConversations;
        console.log(JSON.stringify(updatedConversations));
        this.cdr.detectChanges();
      });
    }
  }

  onDropdownClick(event: Event): void {
    event.stopPropagation(); // Prevent the click event from propagating to the parent div
  }

  onViewProfile(user: User): void {
    console.log(user);
    this.dialog.open(ProfileDialogComponent, {
      data: user,
      width: '400px', // Adjust the width as needed
    });
  }

  searchTerm: string = ''; // Variable to store the search term

  // Use a getter to filter and sort conversations based on the search term and pinning status
  get filteredConversations(): ConversationResponse[] {
    return this.conversationService.conversations
        .filter(conversation =>
            conversation.otherUserName.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          // Pinned conversations should come first
          if (a.isPinned && !b.isPinned) {
            return -1;
          } else if (!a.isPinned && b.isPinned) {
            return 1;
          }
          // For unpinned conversations, maintain their order
          return 0;
        });
  }


  onSelect(conversation: ConversationResponse): void {
    // Update the selected conversation in the ChatService
    this.chatService.setSelectedConversation(conversation);
  }

  onTogglePinConversation(conversation: ConversationResponse): void {
    conversation.isPinned = !conversation.isPinned;
    // Optionally, update your UI or backend to reflect the pinning/unpinning action
  }

  onDeleteConversation(conversationId: string): void {
    // Call the deleteConversation method from the service
    this.conversationService.deleteConversation(conversationId);
    this.conversationService.saveConversationsToStorage();
  }
  private loadConversationsFromStorage(): void {
    if (this.conversations.length === 0) {
      const storedConversations = localStorage.getItem('conversations');

      if (storedConversations) {
        this.conversations = JSON.parse(storedConversations);
        this.conversationsSubject.next([...this.conversations]);
      }
    }
  }



}
