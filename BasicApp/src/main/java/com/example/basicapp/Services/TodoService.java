package com.example.basicapp.Services;

import com.example.basicapp.Entity.Todo;
import com.example.basicapp.Entity.User;
import com.example.basicapp.Repository.TodoRepository;
import com.example.basicapp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    private final TodoRepository todoRepository;
    @Autowired
   private UserRepository userRepository;

    public TodoService(TodoRepository todoRepository)
    {
        this.todoRepository = todoRepository;
    }

    public Todo createTodo(Long userId, Todo todo) {
        // Find the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    Todo newTodo = new Todo();
    newTodo.setTask(todo.getTask());
    newTodo.setTaskDescription(todo.getTaskDescription());
    newTodo.setCompleted(todo.getCompleted());
    newTodo.setStartDate(todo.getStartDate());
    newTodo.setEndDate(todo.getEndDate());
    newTodo.setUser(user);
     return todoRepository.save(newTodo);
    }
    public List<Todo> getTasksForUser(Long userId) {
        // Implement the logic to get tasks for the specified user
        return todoRepository.findTodosByUserId(userId);
    }
    public void deleteTask(Long userId, Long taskId) {
        todoRepository.deleteByIdAndUserId(taskId, userId);
    }

    public Todo updateCompletionStatus(Long userId, Long taskId, boolean completed) {
        // Assuming you have methods in your repository to find the todo by user ID and task ID
        Todo todo = todoRepository.findByUser_IdAndId(userId, taskId)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        todo.setCompleted(completed);
        return todoRepository.save(todo);
    }




}
