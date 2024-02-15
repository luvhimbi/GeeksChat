import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-username-dialog-component',
  templateUrl: './edit-username-dialog-component.component.html',
  styleUrls: ['./edit-username-dialog-component.component.css']
})
export class EditUsernameDialogComponentComponent {
  editedUsername: string;

  constructor(
    public dialogRef: MatDialogRef<EditUsernameDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contactId: string, currentUsername: string }
  ) {
    this.editedUsername = data.currentUsername;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
