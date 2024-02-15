package com.example.basicapp.Services;

import com.example.basicapp.Entity.Conversation;
import com.example.basicapp.Entity.User;
import com.example.basicapp.Repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;

    @Autowired
    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }
    public Conversation getConversationById(int conversationId) {
        return conversationRepository.findById(conversationId).orElse(null);
    }


}
