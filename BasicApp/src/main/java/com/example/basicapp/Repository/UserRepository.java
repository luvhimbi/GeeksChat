package com.example.basicapp.Repository;

import com.example.basicapp.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
   boolean existsByEmail(String email);
   User findByEmail(String email);
   User findUserByEmail(String email);

   @Query("SELECT u FROM User u WHERE u.user_id <> :userId")
   List<User> findAllByUserIdNot(@Param("userId") int userId);
   User findByUsername(String username);

   @Query("SELECT u FROM User u WHERE u.resetToken = :token")
   User findByResetToken(@Param("token") String token);

   @Query("SELECT COUNT(c) > 0 FROM Contact c " +
           "JOIN c.user u " +
           "WHERE u.user_id= :userId AND c.contact_id = :contactedUserId")
   boolean existsByUserIdAndContactedUserId(
           @Param("userId") Long userId,
           @Param("contactedUserId") Long contactedUserId
   );

   User findUserByResetToken(String resetToken);
}
