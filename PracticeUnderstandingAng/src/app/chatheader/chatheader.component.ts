import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { ConversationResponse } from "../conversation-response";
import { ChatService } from "../chat.service";
import Swal from "sweetalert2";
import { StompService } from "../stomp.service";

@Component({
  selector: 'app-chatheader',
  templateUrl: './chatheader.component.html',
  styleUrls: ['./chatheader.component.css']
})
export class ChatheaderComponent implements OnInit {

  selectedConversation: ConversationResponse | null = null;
  conversations: ConversationResponse[] = [];
  onlineStatus: boolean = false; // Variable to store online status

  constructor(private chatService: ChatService, private userService: UserService, private webSocket: StompService) {
  }

  ngOnInit(): void {
    // Subscribe to changes in the selected conversation
    this.chatService.selectedConversation$.subscribe(async (selectedConversation) => {
      this.selectedConversation = selectedConversation;

      // Check online status when conversation changes
      if (selectedConversation) {
        try {
          const user = this.userService.currentUser();
          this.onlineStatus = await this.userService.getOnlineStatus(user.user_id);
        } catch (error) {
          console.error('Error getting online status:', error);
          this.onlineStatus = false; // Set to false if there's an error
        }
      }
    });
  }

  openConfirmationDialog(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.selectedConversation && this.selectedConversation.conversationId) {
          this.webSocket.deleteChat(this.selectedConversation.conversationId).subscribe(
            () => {
              Swal.fire('Deleted!', 'Your chat has been deleted.', 'success');
              console.log(this.selectedConversation?.conversationId)
            },
            (error) => {
              console.error('Error deleting chat:', error);
              Swal.fire('Error', 'An error occurred while deleting the chat.', 'error');
            }
          );
        }
      }
    });
  }
}
