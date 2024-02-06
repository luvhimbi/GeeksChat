import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { ConversationResponse } from "../conversation-response";
import { ChatService } from "../chat.service";

@Component({
  selector: 'app-chatheader',
  templateUrl: './chatheader.component.html',
  styleUrls: ['./chatheader.component.css']
})
export class ChatheaderComponent implements OnInit {

  selectedConversation: ConversationResponse | null = null;
  conversations: ConversationResponse[] = [];
  onlineStatus: boolean = false; // Variable to store online status

  constructor(private chatService: ChatService, private userService: UserService) {
  }

  ngOnInit(): void {
    // Subscribe to changes in the selected conversation
    this.chatService.selectedConversation$.subscribe(async (selectedConversation) => {
      this.selectedConversation = selectedConversation;

      // Check online status when conversation changes
      if (selectedConversation) {
        try {
          const user =this.userService.currentUser()
          this.onlineStatus = await this.userService.getOnlineStatus(user.user_id);
        } catch (error) {
          console.error('Error getting online status:', error);
          this.onlineStatus = false; // Set to false if there's an error
        }
      }
    });
  }
}
