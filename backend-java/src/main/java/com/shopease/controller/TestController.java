package com.shopease.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller to test JWT role-based endpoint protection.
 * Exposes endpoints protected by Spring Security Filter Chain.
 */
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/secure-resource")
    public ResponseEntity<Map<String, Object>> getSecureResource() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Success! You have accessed a secure resource.");
        response.put("userEmail", auth != null ? auth.getName() : "Anonymous");
        response.put("authorities", auth != null ? auth.getAuthorities() : null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buyer-only")
    public ResponseEntity<Map<String, Object>> getBuyerResource() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome, Buyer! This endpoint is restricted to BUYER roles.");
        response.put("userEmail", auth != null ? auth.getName() : "Anonymous");
        response.put("authorities", auth != null ? auth.getAuthorities() : null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/seller-only")
    public ResponseEntity<Map<String, Object>> getSellerResource() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome, Seller! This endpoint is restricted to SELLER roles.");
        response.put("userEmail", auth != null ? auth.getName() : "Anonymous");
        response.put("authorities", auth != null ? auth.getAuthorities() : null);
        return ResponseEntity.ok(response);
    }
}
