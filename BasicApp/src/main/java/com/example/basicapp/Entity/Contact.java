package com.example.basicapp.Entity;

import com.example.basicapp.Entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contact_id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The user who owns this contact

    @ManyToOne
    @JoinColumn(name = "contacted_user_id", nullable = false)
    private User contactedUser; // The user who is being added as a contact

    public Contact(User user, User contactedUser) {
        this.user = user;
        this.contactedUser = contactedUser;
    }


}
