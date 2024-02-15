package com.example.basicapp.Exception;

public class ConversationNotFoundException extends RuntimeException {

    public ConversationNotFoundException() {
        super();
    }

    public ConversationNotFoundException(String message) {
        super(message);
    }

    public ConversationNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public ConversationNotFoundException(Throwable cause) {
        super(cause);
    }
}
