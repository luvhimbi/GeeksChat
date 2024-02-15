package com.example.basicapp.Repository;

import com.example.basicapp.Entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo,Long> {

    @Query("SELECT t FROM Todo t WHERE t.user.user_id = :userId")
    List<Todo> findTodosByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Todo t WHERE t.user.user_id = :userId AND t.id = :taskId")
    Optional<Todo> findByUser_IdAndId(@Param("userId") Long userId, @Param("taskId") Long taskId);
    @Transactional
    @Modifying
    @Query("DELETE FROM Todo t WHERE t.id = :taskId AND t.user.user_id = :userId")
    void deleteByIdAndUserId(@Param("taskId") Long taskId, @Param("userId") Long userId);
}
