package com.example.ExpensiveTracker.controller;

import com.example.ExpensiveTracker.model.User;
import com.example.ExpensiveTracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user.getUsername(), user.getPassword());
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        User authenticatedUser = userService.authenticateUser(user.getUsername(), user.getPassword());
        if (authenticatedUser == null) {
            throw new RuntimeException("Invalid credentials");
        }
        Map<String, String> response = new HashMap<>();
        response.put("token", "dummy-token-" + authenticatedUser.getId());
        return response;
    }

}