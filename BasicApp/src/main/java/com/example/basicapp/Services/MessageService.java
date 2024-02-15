package com.example.basicapp.Services;

import com.example.basicapp.Entity.Conversation;
import com.example.basicapp.Entity.Message;
import com.example.basicapp.Repository.MessageRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRespository messageRepository;


public List<Message> getChatHistoryByConversation(Conversation conversation, int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<Message> messagePage = messageRepository.findByConversationOrderByTimestampDesc(conversation, pageable);
    return messagePage.getContent();
}
}
