package com.example.ExpensiveTracker.repository;

import com.example.ExpensiveTracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

}