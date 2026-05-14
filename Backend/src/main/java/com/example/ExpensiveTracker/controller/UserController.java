package com.example.ExpensiveTracker.controller;

import com.example.ExpensiveTracker.model.User;
import com.example.ExpensiveTracker.service.UserService;
import com.example.ExpensiveTracker.util.AuthTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        User user = userService.getUserById(AuthTokenUtil.getUserIdFromHeader(authHeader));
        return ResponseEntity.ok(toProfileResponse(user));
    }

    @PutMapping("/me/budget")
    public ResponseEntity<Map<String, Object>> updateWeeklyBudget(
            @RequestBody Map<String, BigDecimal> request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        BigDecimal weeklyBudget = request.get("weeklyBudget");
        User user = userService.updateWeeklyBudget(AuthTokenUtil.getUserIdFromHeader(authHeader), weeklyBudget);
        return ResponseEntity.ok(toProfileResponse(user));
    }

    private Map<String, Object> toProfileResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("createdAt", user.getCreatedAt());
        response.put("isEmailVerified", user.getIsEmailVerified());
        response.put("weeklyBudget", user.getWeeklyBudget());
        return response;
    }
}
