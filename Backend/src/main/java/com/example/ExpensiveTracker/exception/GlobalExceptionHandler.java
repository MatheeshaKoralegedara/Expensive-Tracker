package com.example.ExpensiveTracker.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import lombok.*;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RegistrationException.class)
    public ResponseEntity<ErrorResponse> handleRegistrationException(RegistrationException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .message(ex.getMessage())
            .status(HttpStatus.BAD_REQUEST.value())
            .timestamp(System.currentTimeMillis())
            .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse response = ErrorResponse.builder()
            .message("Validation failed")
            .status(HttpStatus.UNPROCESSABLE_ENTITY.value())
            .timestamp(System.currentTimeMillis())
            .errors(errors)
            .build();
        return new ResponseEntity<>(response, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        ErrorResponse error = ErrorResponse.builder()
            .message("An error occurred: " + ex.getMessage())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .timestamp(System.currentTimeMillis())
            .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class ErrorResponse {
    private String message;
    private int status;
    private long timestamp;
    private Map<String, String> errors;
}
