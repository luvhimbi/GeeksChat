package com.example.basicapp.servicesImplementation;

import com.example.basicapp.Entity.Conversation;
import com.example.basicapp.Exception.UserNotFoundException;
import com.example.basicapp.Repository.ContactRepository;
import com.example.basicapp.Entity.Contact;
import com.example.basicapp.Entity.User;
import com.example.basicapp.Repository.ConversationRepository;
import com.example.basicapp.Services.UserService;
import com.example.basicapp.Repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UserServiceImpli implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ConversationRepository conversationRepository;
     @Autowired
    private JavaMailSender javaMailSender;
    @Override
    public User registerUser(User user) {
     User userRegistered=   userRepository.save(user);

        sendWelcomeEmail(userRegistered);
        return userRegistered;
    }

    private void sendWelcomeEmail(User user) {
        System.out.println("Sending Welcome Email.....");

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Welcome to GeeksChat!";
        String recipientAddress = user.getEmail();

        String htmlContent = "<html>"
                + "<body style='font-family: Arial, sans-serif; text-align: center;'>"
                + "<div style='max-width: 600px; margin: 0 auto;'>"
                + "<h2 style='color: #007BFF;'>Welcome to GeeksChat!</h2>"
                + "<p>Dear " + user.getFirstname() + ",</p>"
                + "<p>We are excited to have you on board at GeeksChat! Thank you for joining our community.</p>"
                + "<p>Feel free to explore the platform and connect with other members.</p>"
                + "<p>If you have any questions or need assistance, please don't hesitate to reach out.</p>"
                + "<p>Best regards,</p>"
                + "<p style='color:#007BFF;font-weight:bold'>Geeks Chat </p>"
                + "<p>Founder<br/> Luvhimbi Talifhani</p>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            helper.setFrom("talifhaniluvhimbi@gmail.com");
            helper.setTo(recipientAddress);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // Set the content as HTML

            javaMailSender.send(mimeMessage);

            System.out.println("Welcome Email Sent Successfully!");
        } catch (MessagingException e) {
            System.out.println("Error sending welcome email: " + e.getMessage());
            // Handle the exception as needed
        }

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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        if (user != null) {
            return contactRepository.findAllByUser(user);
        } else {
            // Handle the case where user is null
            return Collections.emptyList(); // or throw an exception, depending on your use case
        }
    }


    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }


    public Conversation createNewRoom(Conversation conversation){

        return conversationRepository.save(conversation);
    }


}
