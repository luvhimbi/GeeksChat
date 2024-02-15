package com.example.basicapp.Controller;

import com.example.basicapp.Entity.Conversation;
import com.example.basicapp.Entity.User;
import com.example.basicapp.Services.ConversationService;
import com.example.basicapp.Services.UserService;
import com.example.basicapp.servicesImplementation.UserServiceImpli;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    @Autowired
    private UserService userServiceImplier;

//    @PostMapping("/api/conversations")
//    public Conversation createConversation(@RequestBody User user1, @RequestBody User user2) {
//        return conversationService.createConversation(user1, user2);
//    }

    @PostMapping("/create")
    public ResponseEntity<Conversation> createConversations(@RequestBody Conversation conversation) {
        Conversation createdConversation = userServiceImplier.createNewRoom(conversation);
        return new ResponseEntity<>(createdConversation, HttpStatus.CREATED);
    }
}
