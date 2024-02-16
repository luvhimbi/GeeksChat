package com.example.basicapp.Controller;

import com.example.basicapp.Entity.Conversation;
import com.example.basicapp.Entity.Message;
import com.example.basicapp.Entity.User;
import com.example.basicapp.Exception.ConversationNotFoundException;
import com.example.basicapp.Repository.MessageRespository;
import com.example.basicapp.Repository.UserRepository;
import com.example.basicapp.Services.ConversationService;
import com.example.basicapp.Services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Controller
public class MessageController {

    @Autowired
    private MessageRespository messageRespository;
    @Autowired
    private UserRepository userRepository;
    private ConversationService conversationService;
    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @MessageMapping("/send-message/{conveId}")
    @SendTo("/topic/received-message/{conveId}")
    public Message handleMessage(@DestinationVariable String conveId, @Payload Message message) {
        System.out.println(conveId);
       //get the sender and reciever
         Optional<User> user1 = userRepository.findById(message.getSender().getUser_id());
        System.out.println(user1.isPresent());
         Optional<User> user2 = userRepository.findById(message.getReceiver().getUser_id());
        // Fetch the conversation by ID
        int conversationId = Integer.parseInt(conveId);
        Conversation conversation = conversationService.getConversationById(conversationId);

        // Check if the conversation exists
        if (conversation != null) {

            message.setConversation(conversation);

            // Save the message to the repository
            messageRespository.save(message);

            // Notify listeners about the new message
            return message;
        } else {
            // Handle the case when the conversation does not exist
            // You can log an error, return an appropriate response, or throw an exception
            throw new ConversationNotFoundException("Conversation with ID " + conveId + " not found");
        }
    }


    @GetMapping("/chat-history/{conversationId}")
    public List<Message> getChatHistory(
            @PathVariable int conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Conversation conversation = conversationService.getConversationById(conversationId);

        if (conversation != null) {
            return messageService.getChatHistoryByConversation(conversation, page, size);
        } else {
            // Handle the case when the conversation does not exist
            // You can return an empty list or an appropriate response
            return Collections.emptyList();
        }
    }
//
//    @GetMapping("/api/messages/old/{conversationId}")
//    public ResponseEntity<List<Message>> getOldMessages(@PathVariable int conversationId) {
//        List<Message> oldMessages = messageService.getOldMessages(conversationId);
//        return ResponseEntity.ok(oldMessages);
//    }


}



