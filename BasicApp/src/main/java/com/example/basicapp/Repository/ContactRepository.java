package com.example.basicapp.Repository;

import com.example.basicapp.Entity.Contact;
import com.example.basicapp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact,Long> {

    Optional<Contact> findByUserAndContactedUser(User user, User contactedUser);

    List<Contact> findAllByUser(User user);



}
