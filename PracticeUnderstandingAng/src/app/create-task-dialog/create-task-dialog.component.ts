import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../user.service";

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.css']
})
export class CreateTaskDialogComponent {
  newTask: any = {
    task: '',
    taskdescription: '',
    completed: false,
    startDate: null,
    endDate: null
  };

  constructor(
    public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onCreateTaskSubmit() {

    const newTask = {
      task: this.newTask.task,
      taskdescription: this.newTask.taskdescription,
      completed: this.newTask.completed,
      startDate: this.newTask.startDate,
      endDate: this.newTask.endDate,
      color: this.getRandomColor(),   user: {
        id: this.userService.getCurrentUserIDFromLocalStorage()
      }

    };

    // Add the new task to the database using the service
    this.userService.addTask(newTask).subscribe(
      response => {
        console.log('Task added successfully:', response);
        // Handle any additional logic or UI updates
      },
      error => {
        console.error('Error adding task:', error);
        // Handle error and provide user feedback
      }
    );

    // Reset newTask and close the dialog
    this.newTask = {};
    this.dialogRef.close(newTask);
  }

  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    console.log('Generated Color:', color); // Add this line
    return color;
  }
}
