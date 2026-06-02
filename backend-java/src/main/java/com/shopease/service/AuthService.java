package com.shopease.service;

import com.shopease.dto.RegisterRequest;
import com.shopease.dto.UserResponse;

/**
 * Service interface outlining user authentication and registration actions.
 */
public interface AuthService {
    /**
     * Registers a new user in the system after checks and hashing passwords.
     * @param request the registration details
     * @return the saved user details
     */
    UserResponse register(RegisterRequest request);
}
