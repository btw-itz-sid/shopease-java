package com.shopease.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Custom JWT Authentication Filter.
 * Intercepts incoming HTTP requests, validates JWT tokens in headers,
 * and populates the Spring Security Context if authentication succeeds.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Autowired
    public JwtFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;
        String role = null;

        // 1. Check for Bearer token in headers
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                if (jwtUtils.validateToken(token)) {
                    email = jwtUtils.getEmailFromToken(token);
                    role = jwtUtils.getRoleFromToken(token);
                }
            } catch (Exception e) {
                // Keep context empty if exception occurs
            }
        }

        // 2. Set Spring Security context if token is valid and user is not already authenticated
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Map the role claim to a SimpleGrantedAuthority.
            // Spring Security expects roles to start with "ROLE_" when using role-based matchers like hasRole("BUYER").
            // E.g., if role is "BUYER", we authorize with "ROLE_BUYER".
            String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleWithPrefix);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    email, null, Collections.singletonList(authority)
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
