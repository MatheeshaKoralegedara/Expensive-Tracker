package com.example.ExpensiveTracker.util;

public final class AuthTokenUtil {

    private static final String TOKEN_PREFIX = "Bearer dummy-token-";

    private AuthTokenUtil() {
    }

    public static Long getUserIdFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith(TOKEN_PREFIX)) {
            throw new RuntimeException("Unauthorized");
        }

        try {
            return Long.parseLong(authHeader.replace(TOKEN_PREFIX, ""));
        } catch (NumberFormatException ex) {
            throw new RuntimeException("Invalid authorization token");
        }
    }
}
