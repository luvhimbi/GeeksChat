package com.example.basicapp.Controller;

import com.example.basicapp.Entity.Todo;
import com.example.basicapp.Services.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @PostMapping("/createTodo/{userId}")
    public Todo createTodo(@PathVariable Long userId, @RequestBody Todo newTodo) {
        return todoService.createTodo(userId, newTodo);
    }

    @GetMapping("/tasks/{userId}")
    public List<Todo> getTasksForUser(@PathVariable Long userId) {
        return todoService.getTasksForUser(userId);
    }

    @PutMapping("/updateCompletionStatus/{userId}/{taskId}")
    public Todo updateCompletionStatus(
            @PathVariable Long userId,
            @PathVariable Long taskId,
            @RequestBody UpdateCompletionStatusRequest request) {
        return todoService.updateCompletionStatus(userId, taskId, request.isCompleted());
    }
    @DeleteMapping("deleteTask/{userId}/{taskId}")
    public void deleteTask(@PathVariable Long userId, @PathVariable Long taskId) {
        todoService.deleteTask(userId, taskId);
    }

    // Create a class to represent the request body for updating completion status
    static class UpdateCompletionStatusRequest {
        private boolean completed;

        public boolean isCompleted() {
            return completed;
        }

        public void setCompleted(boolean completed) {
            this.completed = completed;
        }
    }
}
