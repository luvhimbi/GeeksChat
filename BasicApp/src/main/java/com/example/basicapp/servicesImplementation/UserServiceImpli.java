package com.example.basicapp.servicesImplementation;

import com.example.basicapp.Repository.ContactRepository;
import com.example.basicapp.Entity.Contact;
import com.example.basicapp.Entity.User;
import com.example.basicapp.Services.UserService;
import com.example.basicapp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpli implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public User registerUser(User user) {
       return userRepository.save(user);
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email) ;

    }
    public boolean changePassword(String username, String oldPassword, String newPassword) {
        // Retrieve the user from the database
        User user = userRepository.findByUsername(username);

        // Check if the old password matches the stored password
        if (user != null && oldPassword.equals(user.getPassword())) {
            // Encode and update the new password
            user.setPassword(newPassword);
            userRepository.save(user);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public User updateUserDetails(Long userId, User updatedUser) {
        User existingUser =userRepository.findById(userId)
                .orElseThrow(()->new RuntimeException("user not found"));
        existingUser.setFirstname(updatedUser.getFirstname());
        existingUser.setLastname(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setUsername(updatedUser.getUsername());

        return userRepository.save(existingUser);
    }
@Override
public List<User> getAllUsersExceptCurrentUser(int userId) {
        return userRepository.findAllByUserIdNot(userId);
    }

    @Override
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user != null && user.getPassword().equals(password)) {
            return user;
        } else {
            return null; // Return null if login fails
        }
    }

    @Override
    public Contact addContact(Long userId, Long contactedUserId) {
        // Retrieve the users from the database
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User contactedUser = userRepository.findById(contactedUserId).orElseThrow(() -> new RuntimeException("Contacted user not found"));

        // Check if the contact already exists
        if (contactRepository.findByUserAndContactedUser(user, contactedUser).isPresent()) {
            throw new RuntimeException("Contact already exists");
        }

        // Create and save the contact
        Contact contact = new Contact(user, contactedUser);
        return contactRepository.save(contact);
    }
    @Override
    public List<Contact> getAllContacts(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return contactRepository.findAllByUser(user);
    }


}
