import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { CreateTaskDialogComponent } from "../create-task-dialog/create-task-dialog.component";
import { UserService } from "../user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit {
  tasks: any[] = [];
  totalTasks: number = 0;
  completedTasks: number = 0;
  newTask: any = {};
  showCreateFormFlag: boolean = false;

  constructor(private dialog: MatDialog, private userService: UserService) { }

  ngOnInit(): void {
    // Fetch tasks from the backend when the component initializes
    this.fetchTasks();
  }

  showCreateForm() {
    // Open the dialog
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '500px', // Adjust the width as needed
    });

    // Handle dialog closing
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result (new task) here
        console.log('New task:', result);

        // Update the tasks array
        this.tasks.push(result);
        this.updateTaskStats();
      }
    });
  }

  onDeleteTaskClick(task: any): void {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, delete the task
        this.deleteTask(task);
        Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
      }
    });
  }

  deleteTask(task: any): void {
    // Get the user ID from local storage, providing a default value of 0 if it's null
    const userId = this.userService.getCurrentUserIDFromLocalStorage() ?? 0;

    // Call the service method to delete the task
    this.userService.deleteTask(userId, task.id).subscribe(
      response => {
        console.log('Task deleted successfully:', response);

        // Remove the task from the local tasks array
        const taskIndex = this.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          this.tasks.splice(taskIndex, 1);
        }

        // Update totalTasks and completedTasks
        this.totalTasks = this.tasks.length;
        this.completedTasks = this.tasks.filter(t => t.completed).length;
      },
      error => {
        console.error('Error deleting task:', error);
        // Handle error and provide user feedback
      }
    );
  }


  private updateTaskStats() {
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter(t => t.completed).length;
  }

  private fetchTasks() {
    // Fetch tasks from the backend using the UserService
    this.userService.getAllTasksForUser().subscribe(
      tasks => {
        this.tasks = tasks;
        this.updateTaskStats();
      },
      error => {
        console.error('Error fetching tasks:', error);
        // Handle error and provide user feedback
      }
    );
  }

  formatDateString(dateString: string): string {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    // @ts-ignore
    return date.toLocaleDateString('en-US', options);
  }


  toggleCompletionStatus(task: any): void {
    // Get the user ID from local storage
    const userId = this.userService.getCurrentUserIDFromLocalStorage();

    // Update the completion status using the service
    this.userService.updateCompletionStatus(userId, task.id, !task.completed).subscribe(
      response => {
        console.log('Completion status updated successfully:', response);

        // Update the local completion status
        task.completed = !task.completed;

        // Update the total tasks and completed tasks locally
        this.totalTasks = this.tasks.length;
        this.completedTasks = this.tasks.filter(t => t.completed).length;

        // Decrement totalTasks if the task is marked as completed
        if (task.completed) {
          this.totalTasks--;
        }

        // Handle any additional logic or UI updates
      },
      error => {
        console.error('Error updating completion status:', error);
        // Handle error and provide user feedback
      }
    );
  }





}
