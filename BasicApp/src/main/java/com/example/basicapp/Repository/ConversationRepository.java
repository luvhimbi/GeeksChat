package com.example.basicapp.Repository;

import com.example.basicapp.Entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversationRepository extends JpaRepository<Conversation,Integer> {
}
