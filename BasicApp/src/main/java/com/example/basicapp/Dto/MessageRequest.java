package com.example.basicapp.Dto;

import com.example.basicapp.Entity.Conversation;
import com.example.basicapp.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {
    private User sender;
    private User receiver;
    private Conversation conversation;
    private String message;
}
