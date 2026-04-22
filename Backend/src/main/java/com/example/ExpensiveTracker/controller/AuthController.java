package com.example.ExpensiveTracker.controller;

import com.example.ExpensiveTracker.model.User;
import com.example.ExpensiveTracker.service.UserService;
import com.example.ExpensiveTracker.dto.RegistrationRequest;
import com.example.ExpensiveTracker.dto.RegistrationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * Register a new user with advanced validation
     */
    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = userService.registerUser(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Login with username and password
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        User authenticatedUser = userService.authenticateUser(user.getUsername(), user.getPassword());
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", "dummy-token-" + authenticatedUser.getId());
        response.put("user", new HashMap<String, Object>() {{
            put("id", authenticatedUser.getId());
            put("username", authenticatedUser.getUsername());
            put("email", authenticatedUser.getEmail());
            put("firstName", authenticatedUser.getFirstName());
            put("lastName", authenticatedUser.getLastName());
        }});
        response.put("message", "Login successful");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Verify email with token
     */
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Email verified successfully!");
        
        return ResponseEntity.ok(response);
    }

}