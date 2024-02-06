import { Component } from '@angular/core';
import {ConversationResponse} from "../conversation-response";
import {ConversionServiceService} from "../conversion-service.service";

@Component({
  selector: 'app-archived-chats',
  templateUrl: './archived-chats.component.html',
  styleUrls: ['./archived-chats.component.css']
})
export class ArchivedChatsComponent {
  archivedChats: ConversationResponse[] = [];
  selectedArchivedChat: ConversationResponse | null = null;

  constructor(private conversationService: ConversionServiceService) {}

  ngOnInit(): void {
    this.archivedChats = this.conversationService.getArchivedConversations();
  }

  onSelect(conversation: ConversationResponse): void {
    // Update the selected archived chat
    this.selectedArchivedChat = conversation;

    // You can add additional logic here based on the selected archived chat
    // For example, display details of the selected chat, navigate to a chat detail view, etc.
  }
}
