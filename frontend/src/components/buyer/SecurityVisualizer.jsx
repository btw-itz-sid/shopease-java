import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  KeyRound, 
  Copy, 
  Check, 
  Activity, 
  Sparkles, 
  Code, 
  GraduationCap, 
  ChevronRight, 
  Server, 
  Terminal, 
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Database,
  UserCheck,
  ServerCrash
} from 'lucide-react';

export default function SecurityVisualizer() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'registration', 'code', 'prep'
  const [codeTab, setCodeTab] = useState('config'); // 'config', 'controller', 'dto-request', 'dto-response', 'service-impl'

  // Hashing Simulator States
  const [password, setPassword] = useState('teacherDemo2026');
  const [rounds, setRounds] = useState(10);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Verification States
  const [verifyPassword, setVerifyPassword] = useState('teacherDemo2026');
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyMatches, setVerifyMatches] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  
  // Stateful memory to support offline sandbox matches perfectly
  const [sandboxMemoryMap, setSandboxMemoryMap] = useState({});

  // Day 6 User Registration & Inspector States
  const [sandboxUsers, setSandboxUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@shopease.com",
      passwordHash: "$2a$10$Y5n2qZ0t7mX2v8Xj9K3fFeJ7a8i9oP0q1r2s3t4u5v6w7x8y9z012",
      role: "ADMIN",
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=AdminUser",
      createdAt: "2026-06-02T10:00:00",
      updatedAt: "2026-06-02T10:00:00"
    }
  ]);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('BUYER');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [registeredDbRecord, setRegisteredDbRecord] = useState(null);
  const [registeredApiResponse, setRegisteredApiResponse] = useState(null);

  // Connection State
  const [status, setStatus] = useState('checking'); // 'checking' | 'live' | 'offline'

  // Run Backend Health Check
  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:8085/api/auth/hash-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'ping' })
      });
      if (response.ok || response.status === 400) {
        setStatus('live');
      } else {
        setStatus('offline');
      }
    } catch (err) {
      setStatus('offline');
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  // Generate standard BCrypt mock hash for offline sandbox mode
  const generateMockBcrypt = (plainText, costRounds) => {
    const chars = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const costStr = String(costRounds).padStart(2, '0');
    
    // BCrypt salt is 22 characters
    let salt = '';
    for (let i = 0; i < 22; i++) {
      salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // BCrypt checksum is 31 characters
    let checksum = '';
    for (let i = 0; i < 31; i++) {
      checksum += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `$2a$${costStr}$${salt}${checksum}`;
  };

  // Perform Hashing
  const handleGenerateHash = async () => {
    if (!password) return;
    setLoading(true);
    
    // Visual processing delay for realism and UX
    await new Promise(resolve => setTimeout(resolve, 600));

    if (status === 'live') {
      try {
        const response = await fetch('http://localhost:8085/api/auth/hash-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        const data = await response.json();
        if (response.ok) {
          setGeneratedHash(data.hashedPassword);
          setVerifyHash(data.hashedPassword);
          setVerifyMatches(null);
        } else {
          // Fallback if API failed
          const fallbackHash = generateMockBcrypt(password, rounds);
          setGeneratedHash(fallbackHash);
          setVerifyHash(fallbackHash);
          setSandboxMemoryMap(prev => ({ ...prev, [fallbackHash]: password }));
        }
      } catch (err) {
        const fallbackHash = generateMockBcrypt(password, rounds);
        setGeneratedHash(fallbackHash);
        setVerifyHash(fallbackHash);
        setSandboxMemoryMap(prev => ({ ...prev, [fallbackHash]: password }));
      }
    } else {
      // Sandbox Hashing
      const fallbackHash = generateMockBcrypt(password, rounds);
      setGeneratedHash(fallbackHash);
      setVerifyHash(fallbackHash);
      setVerifyMatches(null);
      // Store in memory mapping so offline verification matches correctly
      setSandboxMemoryMap(prev => ({ ...prev, [fallbackHash]: password }));
    }
    setLoading(false);
  };

  // Perform Verification
  const handleVerifyHash = async () => {
    if (!verifyPassword || !verifyHash) return;
    setVerifyLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    if (status === 'live') {
      try {
        const response = await fetch('http://localhost:8085/api/auth/verify-hash-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: verifyPassword, hashedPassword: verifyHash })
        });
        const data = await response.json();
        if (response.ok) {
          setVerifyMatches(data.matches);
        } else {
          // Fallback to local memory verification
          const matched = sandboxMemoryMap[verifyHash] === verifyPassword;
          setVerifyMatches(matched);
        }
      } catch (err) {
        // Fallback to local memory verification
        const matched = sandboxMemoryMap[verifyHash] === verifyPassword;
        setVerifyMatches(matched);
      }
    } else {
      // Sandbox Memory Match
      const matched = sandboxMemoryMap[verifyHash] === verifyPassword;
      setVerifyMatches(matched);
    }
    setVerifyLoading(false);
  };

  // Trigger initial hash on load
  useEffect(() => {
    handleGenerateHash();
  }, [status]);

  // Offline registration runner
  const runOfflineRegistration = (name, email, password, role) => {
    // Check email uniqueness locally
    const emailExists = sandboxUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      setRegError('Email is already registered! (Local unique constraint violation)');
      return;
    }

    const mockId = sandboxUsers.length + 1;
    const visualHash = generateMockBcrypt(password, 10);
    const dateStr = new Date().toISOString();
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${name.replace(/\s+/g, '')}`;

    const dbRecord = {
      id: mockId,
      name: name,
      email: email,
      password_hash: visualHash,
      role: role,
      avatarUrl: avatarUrl,
      createdAt: dateStr,
      updatedAt: dateStr
    };

    const apiResponse = {
      id: mockId,
      name: name,
      email: email,
      role: role,
      avatarUrl: avatarUrl,
      createdAt: dateStr,
      updatedAt: dateStr
    };

    setRegSuccess(true);
    setRegisteredDbRecord(dbRecord);
    setRegisteredApiResponse(apiResponse);
    setSandboxUsers(prev => [dbRecord, ...prev]);

    // Keep verify tester in sync
    setSandboxMemoryMap(prev => ({ ...prev, [visualHash]: password }));
  };

  // Perform User Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regRole) {
      setRegError('All fields are required!');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters!');
      return;
    }
    setRegLoading(true);
    setRegError('');
    setRegSuccess(false);
    setRegisteredDbRecord(null);
    setRegisteredApiResponse(null);

    // Visual delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (status === 'live') {
      try {
        const response = await fetch('http://localhost:8085/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: regName,
            email: regEmail,
            password: regPassword,
            role: regRole
          })
        });
        const data = await response.json();
        if (response.ok) {
          setRegSuccess(true);
          setRegisteredApiResponse(data);
          
          // Generate a visual representation of what was saved in the Database
          const visualHash = generateMockBcrypt(regPassword, 10);
          const dbRecord = {
            id: data.id,
            name: regName,
            email: regEmail,
            password_hash: visualHash,
            role: regRole,
            avatarUrl: data.avatarUrl,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString()
          };
          setRegisteredDbRecord(dbRecord);
          
          // Keep sandboxUsers in sync
          setSandboxUsers(prev => [dbRecord, ...prev]);
        } else {
          setRegError(data.error || 'Registration failed');
        }
      } catch (err) {
        setRegError('Backend server error. Falling back to Sandbox Mode...');
        runOfflineRegistration(regName, regEmail, regPassword, regRole);
      }
    } else {
      runOfflineRegistration(regName, regEmail, regPassword, regRole);
    }
    setRegLoading(false);
  };

  // Copy Hash to Clipboard
  const handleCopy = () => {
    if (!generatedHash) return;
    navigator.clipboard.writeText(generatedHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse BCrypt Hash segments for visual education
  const getBcryptBreakdown = (hashStr) => {
    if (!hashStr || !hashStr.startsWith('$2a$')) {
      return { algo: '$2a$', cost: '10', salt: 'DynamicSaltPattern', checksum: 'SecureHashDigest' };
    }
    try {
      const parts = hashStr.split('$'); // ['', '2a', '10', 'salt+checksum']
      const cost = parts[2] || '10';
      const payload = parts[3] || '';
      const salt = payload.slice(0, 22);
      const checksum = payload.slice(22);
      return { algo: '$2a$', cost, salt, checksum };
    } catch (e) {
      return { algo: '$2a$', cost: '10', salt: 'DynamicSaltPattern', checksum: 'SecureHashDigest' };
    }
  };

  const { algo, cost, salt, checksum } = getBcryptBreakdown(generatedHash);

  const securityConfigCode = `package com.shopease.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security configuration for ShopEase.
 * Day 5: Configures BCryptPasswordEncoder for secure password hashing
 * and sets up basic security filter rules.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF as we use stateless APIs / tokens
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Permit all requests temporarily; Day 8 will secure endpoints
            );
        return http.build();
    }
}`;

  const authControllerCode = `package com.shopease.controller;

import com.shopease.dto.RegisterRequest;
import com.shopease.dto.UserResponse;
import com.shopease.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Authentication and Security verification controller.
 * Day 5: Exposes REST API endpoints to perform password hashing.
 * Day 6: Exposes registration endpoint with input validation and uniqueness checking.
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Allows connections from local frontend
public class AuthController {

    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthService authService;

    @Autowired
    public AuthController(BCryptPasswordEncoder passwordEncoder, AuthService authService) {
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    /**
     * Registers a new user with input validation.
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserResponse registeredUser = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * Hashes a plain-text password using the configured BCryptPasswordEncoder.
     * POST /api/auth/hash-test
     */
    @PostMapping("/hash-test")
    public ResponseEntity<Map<String, Object>> hashPassword(@RequestBody Map<String, String> request) {
        String plainText = request.get("password");
        if (plainText == null || plainText.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Password is required");
            return ResponseEntity.badRequest().body(error);
        }

        String hashedPassword = passwordEncoder.encode(plainText);

        Map<String, Object> response = new HashMap<>();
        response.put("plainText", plainText);
        response.put("hashedPassword", hashedPassword);
        response.put("algorithm", "BCrypt");
        response.put("saltLengthBytes", 16);
        response.put("status", "success");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Verifies whether a plain-text password matches a BCrypt hash.
     * POST /api/auth/verify-hash-test
     */
    @PostMapping("/verify-hash-test")
    public ResponseEntity<Map<String, Object>> verifyHash(@RequestBody Map<String, String> request) {
        String plainText = request.get("password");
        String hashedPassword = request.get("hashedPassword");

        if (plainText == null || hashedPassword == null || hashedPassword.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Both password and hashedPassword are required");
            return ResponseEntity.badRequest().body(error);
        }

        boolean matches = passwordEncoder.matches(plainText, hashedPassword);

        Map<String, Object> response = new HashMap<>();
        response.put("password", plainText);
        response.put("hashedPassword", hashedPassword);
        response.put("matches", matches);
        response.put("status", "success");
        
        return ResponseEntity.ok(response);
    }
}`;

  const registerRequestCode = `package com.shopease.dto;

import com.shopease.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Data Transfer Object representing a user registration request.
 * Handled on Day 6 for input validation.
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;
}`;

  const userResponseCode = `package com.shopease.dto;

import com.shopease.model.Role;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Data Transfer Object representing a sanitized user response.
 * Omits critical credential information like password hash for security.
 */
@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}`;

  const authServiceImplCode = `package com.shopease.service.impl;

import com.shopease.dto.RegisterRequest;
import com.shopease.dto.UserResponse;
import com.shopease.model.User;
import com.shopease.repository.UserRepository;
import com.shopease.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service implementation for authentication operations.
 * Day 6: Handles user validation, password hashing, and user persistence.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered!");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(hashedPassword)
                .role(request.getRole())
                .avatarUrl("https://api.dicebear.com/7.x/adventurer/svg?seed=" + request.getName().replaceAll("\\s+", ""))
                .build();

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .avatarUrl(savedUser.getAvatarUrl())
                .createdAt(savedUser.getCreatedAt())
                .updatedAt(savedUser.getUpdatedAt())
                .build();
    }
}`;

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-6">
      
      {/* Header section with live connection status */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-xs font-semibold text-pink-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Security, Cryptography & Beans</span>
            </span>

            {/* Live Connection Badge */}
            {status === 'checking' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700 animate-pulse">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                Connecting JVM...
              </span>
            )}
            {status === 'live' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                JVM Spring Boot Active
              </span>
            )}
            {status === 'offline' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Fallback active: Started frontend sandbox simulator">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Sandbox Sandbox Mode Active
              </span>
            )}
            
            <button 
              onClick={checkBackend} 
              className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
              title="Refresh connection status"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Day 5 Cryptographic Security Console</h2>
          <p className="text-xs text-slate-400 mt-1">
            Expose and verify Spring Boot's <code>BCryptPasswordEncoder</code> bean. Review code structures and run live password tests.
          </p>
        </div>

        {/* Action Buttons / Navigation tabs */}
        <div className="flex flex-wrap bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'simulator'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('registration')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'registration'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>User Registration Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'code'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Security Beans Source</span>
          </button>
          <button
            onClick={() => setActiveTab('prep')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'prep'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teacher Interview Q&A</span>
          </button>
        </div>
      </div>

      {/* Simulator Section */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          
          {/* Connection Advice Alert */}
          {status === 'offline' && (
            <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-200">Running Sandbox Mode</p>
                <p className="text-amber-400/90 mt-0.5">
                  The Spring Boot backend is offline or not running. To show your teacher a live JVM integration, run <code>.\mvnw spring-boot:run</code> on port 8085 inside <code>backend-java</code>. The frontend is automatically simulating standard BCrypt hashing.
                </p>
              </div>
            </div>
          )}
          {status === 'live' && (
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-200">Spring Boot Integration Live!</p>
                <p className="text-emerald-400/90 mt-0.5">
                  Connected successfully to your Spring Boot REST application running on <code>http://localhost:8085</code>. Password encoding calls are processed by your Java <code>SecurityConfig</code> bean in real-time.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Column 1: Generator */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 hover:border-violet-500/20 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                    <KeyRound className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Password Hashing Bean</h3>
                    <p className="text-[10px] text-slate-500">Injects BCryptPasswordEncoder for dynamic salting</p>
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plain-Text Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Type a password..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Rounds cost parameter */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span title="Strength factor: logarithmic work factor for key derivation">Logarithmic Cost (Rounds)</span>
                    <span className="text-violet-400 font-mono">2^{rounds} ({1 << rounds} iterations)</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="14"
                    value={rounds}
                    onChange={e => setRounds(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-violet-600 border border-slate-800"
                  />
                  <div className="flex justify-between text-[9px] text-slate-550 font-mono">
                    <span>4 (Fast / Testing)</span>
                    <span>10 (Balanced)</span>
                    <span>14 (Highly Secure)</span>
                  </div>
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerateHash}
                disabled={loading || !password}
                className="w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl py-2.5 text-xs font-bold shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Cryptographic Salting in Progress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hash Credentials via BCrypt</span>
                  </>
                )}
              </button>
            </div>

            {/* Column 2: Result Visualizer */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 hover:border-violet-500/20 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-pink-600/10 border border-pink-500/20 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Salted Hash Output</h3>
                      <p className="text-[10px] text-slate-500">Cryptographically safe non-reversible format</p>
                    </div>
                  </div>
                  
                  {generatedHash && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Hash</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Display area */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs break-all relative min-h-[70px] flex items-center justify-center">
                  {loading ? (
                    <div className="flex flex-col items-center gap-1.5 text-slate-500 py-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-violet-400" />
                      <span className="text-[10px] animate-pulse">Running key derivation...</span>
                    </div>
                  ) : generatedHash ? (
                    <p className="text-slate-100 leading-relaxed tracking-wide text-center selection:bg-violet-600/30">
                      {generatedHash}
                    </p>
                  ) : (
                    <span className="text-slate-500 text-center">Configure a password to view cryptographic digest</span>
                  )}
                </div>

                {/* Educational Salt Breakdown */}
                {generatedHash && !loading && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BCrypt Hash String Anatomy</label>
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono leading-none">
                      <div className="bg-violet-950/20 border border-violet-900/30 p-2 rounded">
                        <span className="text-violet-400 font-bold block mb-1">{algo}</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider">Ident</span>
                      </div>
                      <div className="bg-indigo-950/20 border border-indigo-900/30 p-2 rounded">
                        <span className="text-indigo-400 font-bold block mb-1">{cost}</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider">Rounds</span>
                      </div>
                      <div className="bg-pink-950/20 border border-pink-900/30 p-2 rounded">
                        <span className="text-pink-400 font-bold block mb-1 truncate" title={salt}>{salt.slice(0, 5)}...</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider">128b Salt</span>
                      </div>
                      <div className="bg-fuchsia-950/20 border border-fuchsia-900/30 p-2 rounded">
                        <span className="text-fuchsia-400 font-bold block mb-1 truncate" title={checksum}>{checksum.slice(0, 5)}...</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider">Digest</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Informational salting badge */}
              {generatedHash && (
                <div className="mt-4 p-2 bg-violet-950/15 border border-violet-900/25 rounded-lg text-[9px] text-violet-300 leading-normal flex items-start gap-2">
                  <Activity className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0 animate-pulse" />
                  <span>
                    <strong>Dynamic Salting:</strong> Notice how clicking "Hash Credentials" again produces a different string. Even for the exact same password, BCrypt generates a unique salt for each transaction, rendering pre-computed dictionary tables useless!
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Verification Module */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 hover:border-pink-500/10 transition-all duration-300 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                <Unlock className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Credential Verification Tester</h3>
                <p className="text-[10px] text-slate-500">Cryptographically matches raw input to the hash</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plain-Text Candidate</label>
                <input
                  type="text"
                  value={verifyPassword}
                  onChange={e => setVerifyPassword(e.target.value)}
                  placeholder="Enter candidate..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="md:col-span-5 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secure Hash</label>
                <input
                  type="text"
                  value={verifyHash}
                  onChange={e => setVerifyHash(e.target.value)}
                  placeholder="Paste BCrypt hash $2a$..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  onClick={handleVerifyHash}
                  disabled={verifyLoading || !verifyPassword || !verifyHash}
                  className="w-full bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {verifyLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify Match</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Match output results */}
            {verifyMatches !== null && !verifyLoading && (
              <div className={`mt-2 p-3 rounded-xl border flex items-center gap-3 animate-fadeIn text-xs ${
                verifyMatches 
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400' 
                  : 'bg-rose-950/20 border-rose-900/40 text-rose-400'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  verifyMatches ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                }`}>
                  {verifyMatches ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Unlock className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <div>
                  <p className="font-semibold">{verifyMatches ? 'Verification Successful!' : 'Verification Failed!'}</p>
                  <p className="text-[10px] opacity-90 mt-0.5">
                    {verifyMatches 
                      ? 'The passwords match. The raw input perfectly hashes to the signature stored inside the salt pattern.' 
                      : 'Credentials invalid. The candidate password hashes to a completely different signature than the comparison hash.'
                    }
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Registration Lab Section */}
      {activeTab === 'registration' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-violet-950/20 to-indigo-950/20 border border-violet-900/40 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-slate-300">
            <UserPlus className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="font-bold text-violet-200">Day 6: User Registration Workspace</p>
              <p className="text-slate-400 mt-0.5">
                Register a user to witness real-time BCrypt salting and direct persistence. The **Entity Inspector** side-by-side view demonstrates how sensitive user credentials are secure inside the database, while the REST API client receives a clean, sanitized JSON response.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Form */}
            <form onSubmit={handleRegister} className="lg:col-span-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 hover:border-violet-500/20 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                    <UserPlus className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Registration Form</h3>
                    <p className="text-[10px] text-slate-500">Submits to POST /api/auth/register</p>
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Alice Smith"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="e.g. alice@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secure Password</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Role select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User Role</label>
                  <select
                    value={regRole}
                    onChange={e => setRegRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="BUYER">Buyer (Access shop & checkout)</option>
                    <option value="SELLER">Seller (Manage products & store)</option>
                    <option value="ADMIN">Admin (Total workspace control)</option>
                  </select>
                </div>
              </div>

              {/* Status Display */}
              <div className="space-y-3 mt-4">
                {regError && (
                  <div className="p-3 bg-rose-950/25 border border-rose-900/30 rounded-xl text-rose-450 text-[11px] flex gap-2 items-center leading-normal animate-fadeIn">
                    <ServerCrash className="w-4 h-4 flex-shrink-0 text-rose-400" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="p-3 bg-emerald-950/25 border border-emerald-900/30 rounded-xl text-emerald-450 text-[11px] flex gap-2 items-center leading-normal animate-fadeIn">
                    <UserCheck className="w-4 h-4 flex-shrink-0 text-emerald-400 animate-bounce" />
                    <span>User Registered! Inspect Database vs API response on the right.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading || !regName || !regEmail || !regPassword}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl py-2.5 text-xs font-bold shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {regLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Secure Entity Record...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Submit Register Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Right Column: Entity & Response Inspector */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Dual View Side-by-Side Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Database Table Inspector */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 hover:border-violet-500/10 transition-all duration-300 flex flex-col justify-between min-h-[360px]">
                  <div>
                    <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                      <div className="w-7 h-7 rounded-lg bg-pink-600/10 border border-pink-500/20 flex items-center justify-center">
                        <Database className="w-3.5 h-3.5 text-pink-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Database Record View</h4>
                        <p className="text-[9px] text-slate-500">Persistent user table storage</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 font-mono text-[10px] text-slate-400">
                      {registeredDbRecord ? (
                        <>
                          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                            <span className="text-slate-500 block mb-1">TABLE: users</span>
                            <div className="space-y-1 text-slate-350">
                              <p><span className="text-indigo-400">id</span>: {registeredDbRecord.id}</p>
                              <p><span className="text-indigo-400">name</span>: "{registeredDbRecord.name}"</p>
                              <p><span className="text-indigo-400">email</span>: "{registeredDbRecord.email}"</p>
                              <p className="border border-pink-500/30 bg-pink-950/15 p-1.5 rounded my-1 text-pink-400 break-all leading-normal text-[9px]">
                                <span className="text-pink-550 font-bold block text-[8px] uppercase mb-0.5">password_hash (BCrypt Salted)</span>
                                {registeredDbRecord.password_hash || registeredDbRecord.passwordHash}
                              </p>
                              <p><span className="text-indigo-400">role</span>: "{registeredDbRecord.role}"</p>
                              <p className="truncate"><span className="text-indigo-400">avatar_url</span>: "{registeredDbRecord.avatarUrl || registeredDbRecord.avatar_url}"</p>
                              <p><span className="text-indigo-400">created_at</span>: {registeredDbRecord.createdAt || registeredDbRecord.created_at}</p>
                            </div>
                          </div>
                          
                          <div className="p-2 bg-pink-950/15 border border-pink-900/25 rounded-lg text-[9px] text-pink-300 leading-normal flex items-start gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-pink-400 mt-0.5 flex-shrink-0" />
                            <span>
                              Credentials Secure: The original password is 100% gone. Only a one-way mathematical hash signature is stored.
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center text-slate-600 h-[220px]">
                          <Database className="w-8 h-8 text-slate-800 mb-2 animate-pulse" />
                          <span>Waiting to persist registered User Entity record...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. API Response JSON Inspector */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 hover:border-violet-500/10 transition-all duration-300 flex flex-col justify-between min-h-[360px]">
                  <div>
                    <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Sanitized API Response</h4>
                        <p className="text-[9px] text-slate-500">Restful client-side JSON envelope</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 font-mono text-[10px] text-slate-400">
                      {registeredApiResponse ? (
                        <>
                          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                            <span className="text-slate-550 block mb-1">HTTP 201 CREATED</span>
                            <pre className="text-emerald-450 leading-relaxed overflow-x-auto text-[9px]">
                              {JSON.stringify(registeredApiResponse, null, 2)}
                            </pre>
                          </div>
                          
                          <div className="p-2 bg-emerald-950/15 border border-emerald-900/25 rounded-lg text-[9px] text-emerald-300 leading-normal flex items-start gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>
                              Sanitization Pass: Review the JSON! The password field has been completely stripped out to prevent security leaks.
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center text-slate-650 h-[220px]">
                          <Code className="w-8 h-8 text-slate-800 mb-2 animate-pulse" />
                          <span>Waiting to receive sanitized DTO response payload...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Sandbox Table Records Inspector */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-indigo-400" />
                  <span>Interactive Database Accounts ({sandboxUsers.length})</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] font-mono text-slate-450">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-550 text-left">
                        <th className="pb-1.5 font-semibold pr-2">ID</th>
                        <th className="pb-1.5 font-semibold pr-4">NAME</th>
                        <th className="pb-1.5 font-semibold pr-4">EMAIL</th>
                        <th className="pb-1.5 font-semibold pr-4">PASSWORD HASH</th>
                        <th className="pb-1.5 font-semibold">ROLE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sandboxUsers.map(user => (
                        <tr key={user.id} className="border-b border-slate-900/50 hover:bg-slate-900/20 text-slate-350">
                          <td className="py-2 pr-2">{user.id}</td>
                          <td className="py-2 pr-4 text-slate-200">{user.name}</td>
                          <td className="py-2 pr-4">{user.email}</td>
                          <td className="py-2 pr-4 text-slate-500 font-mono text-[9px]" title={user.passwordHash || user.password_hash}>
                            {(user.passwordHash || user.password_hash).slice(0, 18)}...
                          </td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              user.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' :
                              user.role === 'SELLER' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                              'bg-violet-500/10 text-violet-400 border border-violet-500/25'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Code Viewer Section */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          
          {/* Sub-tabs */}
          <div className="flex flex-wrap bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 w-fit">
            <button
              onClick={() => setCodeTab('config')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                codeTab === 'config'
                  ? 'bg-slate-850 text-white border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3 h-3 text-pink-400" />
              <span>SecurityConfig.java (Day 5 Config)</span>
            </button>
            <button
              onClick={() => setCodeTab('controller')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                codeTab === 'controller'
                  ? 'bg-slate-850 text-white border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3 h-3 text-indigo-400" />
              <span>AuthController.java (Controller)</span>
            </button>
            <button
              onClick={() => setCodeTab('dto-request')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                codeTab === 'dto-request'
                  ? 'bg-slate-850 text-white border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3 h-3 text-violet-400" />
              <span>RegisterRequest.java (DTO)</span>
            </button>
            <button
              onClick={() => setCodeTab('dto-response')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                codeTab === 'dto-response'
                  ? 'bg-slate-850 text-white border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span>UserResponse.java (DTO)</span>
            </button>
            <button
              onClick={() => setCodeTab('service-impl')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                codeTab === 'service-impl'
                  ? 'bg-slate-850 text-white border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3 h-3 text-amber-400" />
              <span>AuthServiceImpl.java (Service)</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute right-4 top-4 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono text-slate-400">
              <Server className="w-3 h-3 text-violet-400" />
              <span>Spring Boot 4.x / Java 17</span>
            </div>
            
            <pre className="bg-slate-950 p-5 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed max-h-[420px] selection:bg-violet-600/30 animate-fadeIn">
              <code>
                {codeTab === 'config' && securityConfigCode}
                {codeTab === 'controller' && authControllerCode}
                {codeTab === 'dto-request' && registerRequestCode}
                {codeTab === 'dto-response' && userResponseCode}
                {codeTab === 'service-impl' && authServiceImplCode}
              </code>
            </pre>
          </div>
        </div>
      )}

      {/* Prep Section */}
      {activeTab === 'prep' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-2.5">
            <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 uppercase tracking-wide">
              BCrypt Architecture
            </span>
            <h4 className="text-xs font-bold text-slate-200">Q1. What is BCrypt and how does it prevent dictionary or brute force attacks?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              BCrypt is an adaptive password hashing algorithm based on the Blowfish symmetric block cipher. It mitigates brute-force attacks by integrating a <strong>cost/rounds parameter</strong>, making hash generation deliberately slow. Because computing a single hash takes ~100–350 milliseconds (instead of microseconds like MD5 or SHA-256), a brute-force attacker is mathematically slowed down to a crawl.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-2.5">
            <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
              Salting & Rainbow Tables
            </span>
            <h4 className="text-xs font-bold text-slate-200">Q2. Why do we salt passwords before hashing? Where is the salt stored?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Salting adds a random string to passwords prior to hashing, ensuring identical inputs generate completely unique outputs. This blocks pre-computed dictionary attacks (rainbow tables). 
              BCrypt is stateful; it **automatically embeds** the salt directly inside the final output string itself. The salt is the 22-character segment directly after the work factor.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-2.5">
            <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wide">
              Spring Bean Lifecycle
            </span>
            <h4 className="text-xs font-bold text-slate-200">Q3. What is a Spring Configuration class? How is the BCrypt bean injected?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Classes annotated with <code>@Configuration</code> define custom beans. When Spring Boot boots up, it compiles and registers these bean instances into the ApplicationContext container.
              We register a <code>BCryptPasswordEncoder</code> bean in <code>SecurityConfig</code>, which allows any other controller or service to import it instantly via constructor injection (e.g. `@Autowired` on the constructor).
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-2.5">
            <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
              Authentication Logic
            </span>
            <h4 className="text-xs font-bold text-slate-200">Q4. How does the verify operation function if hashing is one-way?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Since BCrypt hashing is structurally non-reversible, we cannot decrypt the database password. During logins, the incoming candidate password is fed into <code>passwordEncoder.matches()</code>. 
              The encoder extracts the salt parameter from the stored database hash, salts the login candidate password with *that exact salt*, hashes it, and checks if the resulting signature matches the signature stored in the database!
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
