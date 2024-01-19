package com.example.basicapp.Controller;

import com.example.basicapp.Dto.ChangePasswordRequest;
import com.example.basicapp.Dto.LoginRequest;
import com.example.basicapp.Dto.UserDto;
import com.example.basicapp.Entity.Contact;
import com.example.basicapp.Entity.User;
import com.example.basicapp.Services.ForgetPasswordService;
import com.example.basicapp.Services.UserService;
import com.example.basicapp.Exception.UserNotFoundException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = {"Authorization", "Content-Type"})
@RestController
@RequestMapping("/api/user")

public class UserController {
    @Autowired
    private UserService userService;

@Autowired
private ForgetPasswordService forgetPasswordService;
//this is a method which will add people when the add contact  is clicked!

    @PostMapping("/add")
    public ResponseEntity<Contact> addContact(@RequestBody Map<String, Object> payload) {
        Long userId = ((Number) payload.get("user_id")).longValue();
        Long contactedUserId = ((Number) payload.get("contactedUserId")).longValue();
            Contact newContact = userService.addContact(userId, contactedUserId);
            return new ResponseEntity<>(newContact, HttpStatus.CREATED);

    }
//this is a method which will get all contacts from the database

    @GetMapping("/all")
    public ResponseEntity<List<Contact>> getAllContacts(@RequestParam Long userId) {
        try {
            List<Contact> contacts = userService.getAllContacts(userId);
            return new ResponseEntity<>(contacts, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //this is method to get all registered users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAll();
        return ResponseEntity.ok(users);
    }
    //this is a method to get all users except the currently logged in user

    @GetMapping("/except/{userId}")
    public ResponseEntity<List<User>> getAllUsersExceptCurrentUser(@PathVariable int userId) {
        List<User> users = userService.getAllUsersExceptCurrentUser(userId);
        return ResponseEntity.ok(users);
    }
    //this is a method to update the users details
    /*

     */

    @PutMapping("/{userId}")
    public ResponseEntity<Object> updateUserDetails(@PathVariable Long userId, @RequestBody User updatedUser) {
        User updatedUserData = userService.updateUserDetails(userId, updatedUser);

        // You can customize the response based on your needs
        if (updatedUserData != null) {
            return new ResponseEntity<>(updatedUserData, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found with id: " + userId, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> initiatePasswordReset(@RequestBody String email) {
        try {
            forgetPasswordService.initiatePasswordReset(email);
            return ResponseEntity.ok(new Response("Password reset initiated. Check your email for further instructions."));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Response("User not found."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("Failed to initiate password reset. Please try again later."));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        // Assuming you have a service layer (UserService) to handle the logic
        boolean passwordChanged = userService.changePassword(request.getUsername(), request.getOldPassword(), request.getNewPassword());

        if (passwordChanged) {
            return ResponseEntity.ok(new Response("Password changed successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Response("Invalid username or password"));
        }
    }
    @PostMapping()
    public ResponseEntity<?> saveUSER(@Valid @RequestBody UserDto userDto) {


        // Check for null or blank values in firstname
        if (userDto.getFirstname() == null || userDto.getFirstname().isBlank()) {
            throw new IllegalArgumentException("Firstname cannot be null or blank");
        }

        // Check for null or blank values in lastname
        if (userDto.getLastname() == null || userDto.getLastname().isBlank()) {
            throw new IllegalArgumentException("Lastname cannot be null or blank");
        }

        // Check for null or blank values in email
        if (userDto.getEmail() == null || userDto.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or blank");
        }

        // Check for null or blank values in username
        if (userDto.getUsername() == null || userDto.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or blank");
        }

        // Check for null or blank values in password
        if (userDto.getPassword() == null || userDto.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or blank");
        }
        if (userService.emailExists(userDto.getEmail())) {
            // Return a custom error response
            return ResponseEntity.badRequest().body("Email already exists. Please use a different email.");
        }

        // If all checks pass, proceed with saving the user
        User user = new User();
        user.setFirstname(userDto.getFirstname());
        user.setLastname(userDto.getLastname());
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());

        return ResponseEntity.ok(userService.registerUser(user));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : result.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(errors);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

        if (user != null) {
            // Successful login
            return ResponseEntity.ok(user);
        } else {
            // Unauthorized
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    class Response{

        private String msg;


    }
}
