package com.example.basicapp.Services;

import com.example.basicapp.Entity.Contact;
import com.example.basicapp.Entity.Conversation;
import com.example.basicapp.Entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    public User registerUser(User user);
    public List<User> getAll();
    public boolean emailExists(String email);
    User login(String email, String password);
    public boolean changePassword(String username, String oldPassword, String newPassword);
    public User updateUserDetails(Long userId, User updatedUser);
    public List<User> getAllUsersExceptCurrentUser(int userId);
    public Contact addContact(Long userId, Long contactedUserId);
    public List<Contact> getAllContacts(Long userId);
    public Optional<User> getUserById(Long userId);
    public Conversation createNewRoom(Conversation conversation);


    boolean contactExists(Long userId, Long contactedUserId);
}
