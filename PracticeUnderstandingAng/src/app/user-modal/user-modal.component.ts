// user-modal.component.ts
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Contact} from "../User";
import {Router} from "@angular/router";
import {ChatService} from "../chat.service";
import {ConversationResponse} from "../conversation-response";
import {ConversionServiceService} from "../conversion-service.service";
import {
  EditUsernameDialogComponentComponent
} from "../edit-username-dialog-component/edit-username-dialog-component.component";

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Contact,
              private router: Router,
              private dialogRef: MatDialogRef<UserModalComponent>,
              private chatService: ChatService,
              private conversationService: ConversionServiceService,private dialog: MatDialog) {}

  startChatAndNavigate() {
    this.dialogRef.close();

    // Assuming you have a message to initialize the conversation
    const initialMessage = "";

    // Provide the initialMessage parameter
    this.conversationService.createConversation(this.data, initialMessage);
    this.router.navigate(['/home']);
  }


}
