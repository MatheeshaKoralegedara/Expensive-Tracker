package com.example.ExpensiveTracker.service;

import com.example.ExpensiveTracker.model.User;
import com.example.ExpensiveTracker.repository.UserRepository;
import com.example.ExpensiveTracker.dto.RegistrationRequest;
import com.example.ExpensiveTracker.dto.RegistrationResponse;
import com.example.ExpensiveTracker.exception.RegistrationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Email validation pattern
    private static final String EMAIL_PATTERN = 
        "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final Pattern emailPattern = Pattern.compile(EMAIL_PATTERN);

    /**
     * Register a new user with comprehensive validation
     */
    public RegistrationResponse registerUser(RegistrationRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RegistrationException("Passwords do not match");
        }

        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()) != null) {
            throw new RegistrationException("Username already exists. Please choose a different username.");
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RegistrationException("Email already registered. Please use a different email or login.");
        }

        // Validate email format
        if (!isValidEmail(request.getEmail())) {
            throw new RegistrationException("Invalid email format");
        }

        // Validate password strength
        validatePasswordStrength(request.getPassword());

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail().toLowerCase());
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerificationToken(generateVerificationToken());
        user.setIsEmailVerified(false); // Will be set to true after email verification

        User savedUser = userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getFirstName(), savedUser.getEmailVerificationToken());
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to send verification email: " + e.getMessage());
        }

        return buildRegistrationResponse(savedUser, "Registration successful! Please check your email to verify your account.");
    }

    /**
     * Authenticate user during login
     */
    public User authenticateUser(String username, String password) {
        User user = userRepository.findByUsername(username);
        
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            if (!user.getIsEmailVerified()) {
                throw new RegistrationException("Please verify your email before logging in.");
            }
            return user;
        }
        
        throw new RegistrationException("Invalid username or password");
    }

    /**
     * Verify user email with token
     */
    public void verifyEmail(String token) {
        User user = userRepository.findAll().stream()
            .filter(u -> u.getEmailVerificationToken() != null && u.getEmailVerificationToken().equals(token))
            .findFirst()
            .orElseThrow(() -> new RegistrationException("Invalid verification token"));

        user.setIsEmailVerified(true);
        user.setEmailVerificationToken(null);
        User updatedUser = userRepository.save(user);

        // Send welcome email
        try {
            emailService.sendWelcomeEmail(updatedUser.getEmail(), updatedUser.getFirstName(), updatedUser.getLastName());
        } catch (Exception e) {
            // Log error but don't fail verification
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }

    /**
     * Validate password strength
     * Requirements: minimum 8 characters, uppercase, lowercase, number, special character
     */
    private void validatePasswordStrength(String password) {
        if (password.length() < 8) {
            throw new RegistrationException("Password must be at least 8 characters long");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new RegistrationException("Password must contain at least one uppercase letter");
        }

        if (!password.matches(".*[a-z].*")) {
            throw new RegistrationException("Password must contain at least one lowercase letter");
        }

        if (!password.matches(".*\\d.*")) {
            throw new RegistrationException("Password must contain at least one number");
        }

        if (!password.matches(".*[@$!%*?&].*")) {
            throw new RegistrationException("Password must contain at least one special character (@$!%*?&)");
        }
    }

    /**
     * Validate email format
     */
    private boolean isValidEmail(String email) {
        return emailPattern.matcher(email).matches();
    }

    /**
     * Generate email verification token
     */
    private String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }

    /**
     * Build registration response DTO
     */
    private RegistrationResponse buildRegistrationResponse(User user, String message) {
        return RegistrationResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .createdAt(user.getCreatedAt())
            .isEmailVerified(user.getIsEmailVerified())
            .message(message)
            .build();
    }

}