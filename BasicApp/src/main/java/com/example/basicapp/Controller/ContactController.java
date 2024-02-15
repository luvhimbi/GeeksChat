package com.example.basicapp.Controller;

import com.example.basicapp.Entity.Contact;
import com.example.basicapp.Repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;
    @PutMapping("/{contactId}/allowChat")
    public ResponseEntity<String> allowChat(@PathVariable Long contactId) {
        // Assuming ContactService has a method to update the canChat property
        Contact contact = contactRepository.findById(contactId).orElse(null);

        if (contact != null) {
            // Update the canChat property to true
            contact.setCanChat(true);

            // Save the updated contact
            contactRepository.save(contact);
            return ResponseEntity.status(HttpStatus.OK).body(null);

        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Contact not found");
        }
    }


}
