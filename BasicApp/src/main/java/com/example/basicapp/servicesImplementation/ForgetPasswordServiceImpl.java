package com.example.basicapp.servicesImplementation;

import com.example.basicapp.Entity.User;
import com.example.basicapp.CustomClasses.PasswordGenerator;
import com.example.basicapp.Services.ForgetPasswordService;
import com.example.basicapp.Exception.UserNotFoundException;
import com.example.basicapp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class ForgetPasswordServiceImpl implements ForgetPasswordService {


    @Autowired
    UserRepository userRepository;

    @Autowired
    private JavaMailSender javaMailSender;
 @Autowired
 PasswordGenerator passwordGenerator;
    @Override
    public void initiatePasswordReset(String email) {

        System.out.println("User email: "+email);
        User user = userRepository.findUserByEmail(email);
        System.out.println(user);
        if (user == null) {
            throw new UserNotFoundException("User with email " + email + " not found.");
        }
            String newPassword=passwordGenerator.generateRandomPassword(12);
            user.setPassword(newPassword);
            userRepository.save(user);
            sendResetEmail(user,newPassword);




    }

    private void sendResetEmail(User user,String newPassword ) {
        System.out.println("Sending Email.....");

        SimpleMailMessage message = new SimpleMailMessage();
        Random rand= new Random(1000);
        message.setFrom("talifhaniluvhimbi@gmail.com");
        message.setTo(user.getEmail());
        message.setSubject("Password reset");
        user.setPassword(newPassword);
        message.setText("Good day "+user.getFirstname()+"/n"+"your new password is :"+newPassword);

        javaMailSender.send(message);
    }


}
