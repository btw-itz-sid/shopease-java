package com.shopease.config;

import com.shopease.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration for ShopEase.
 * Configures BCryptPasswordEncoder, stateless session management,
 * custom JWT filter integration, and endpoint access control policies.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Autowired
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF as we use stateless JWT tokens
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public auth endpoints
                .requestMatchers("/auth/**").permitAll()
                // Public catalog browsing
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/categories/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/products/**").permitAll()
                // Category write operations (Admin only)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/categories").hasRole("ADMIN")
                // Product write operations (Sellers & Admins)
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/products").hasAnyRole("SELLER", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/products/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/products/**").authenticated()
                // Protected test endpoints
                .requestMatchers("/api/test/secure-resource").authenticated()
                .requestMatchers("/api/test/buyer-only").hasRole("BUYER")
                .requestMatchers("/api/test/seller-only").hasRole("SELLER")
                // Default fallback
                .anyRequest().authenticated()
            )
            // Add custom JWT filter before the standard UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
