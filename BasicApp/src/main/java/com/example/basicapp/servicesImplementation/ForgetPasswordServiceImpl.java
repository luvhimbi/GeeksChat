package com.example.basicapp.servicesImplementation;

import com.example.basicapp.Entity.User;
import com.example.basicapp.CustomClasses.PasswordGenerator;
import com.example.basicapp.Services.ForgetPasswordService;
import com.example.basicapp.Exception.UserNotFoundException;
import com.example.basicapp.Repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
public class ForgetPasswordServiceImpl implements ForgetPasswordService {


    @Autowired
    UserRepository userRepository;

    @Autowired
    private JavaMailSender javaMailSender;
 @Autowired
 PasswordGenerator passwordGenerator;

    /**
     *
     * @param email
     *this is a method which recieves the email from the user frontened to initiate password reset
     */
    @Override
    public int initiatePasswordReset(String email) {
        System.out.println("User email: " + email);
        User user = userRepository.findUserByEmail(email);
        System.out.println(user);
        if (user == null) {
            throw new UserNotFoundException("User with email " + email + " not found.");
        }

        // Generate a random 5-digit number
        int resetCode = (int) (Math.random() * 90000) + 10000;

        user.setResetToken(String.valueOf(resetCode));
        sendPasswordResetEmail(user, resetCode);

        return resetCode; // Return the generated reset code to the frontend
    }
    private void sendPasswordResetEmail(User user, int resetCode) {
        System.out.println("Sending Password Reset Email.....");

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Password Reset Code";
        String recipientAddress = user.getEmail();

        String htmlContent = "<html>"
                + "<body style='font-family: Arial, sans-serif; text-align: center;'>"
                + "<div style='max-width: 600px; margin: 0 auto;'>"
                + "<h2 style='color: #007BFF;'>Password Reset Code</h2>"
                + "<p>Good day " + user.getFirstname() + ",</p>"
                + "<p>You have requested a password reset. Use the following code to reset your password:</p>"
                + "<h1 style='font-size: 2em;'>" + resetCode + "</h1>"
                + "<p>If you didn't initiate this password reset or have any concerns, please contact support.</p>"
                + "<p>Best regards,</p>"
                + "<p style='color:#007BFF;font-weight:bold;'>Geeks Chat </p>"
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

            System.out.println("Password Reset Code Email Sent Successfully!");
        } catch (MessagingException e) {
            System.out.println("Error sending password reset code email: " + e.getMessage());
            // Handle the exception as needed
        }
    }



}
