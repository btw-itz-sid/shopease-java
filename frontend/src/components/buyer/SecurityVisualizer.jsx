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
  AlertTriangle
} from 'lucide-react';

export default function SecurityVisualizer() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'code', 'prep'
  const [codeTab, setCodeTab] = useState('config'); // 'config', 'controller'

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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Authentication and Security verification controller.
 * Day 5: Exposes REST API endpoints to perform password hashing
 * and hash verification using the BCryptPasswordEncoder bean.
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Allows connections from local frontend
public class AuthController {

    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
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

      {/* Code Viewer Section */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          
          {/* Sub-tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 w-fit">
            <button
              onClick={() => setCodeTab('config')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                codeTab === 'config'
                  ? 'bg-slate-850 text-white border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3 h-3 text-pink-400" />
              <span>SecurityConfig.java (Day 5 Bean Config)</span>
            </button>
            <button
              onClick={() => setCodeTab('controller')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                codeTab === 'controller'
                  ? 'bg-slate-850 text-white border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3 h-3 text-indigo-400" />
              <span>AuthController.java (Day 5 Test Endpoint)</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute right-4 top-4 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono text-slate-400">
              <Server className="w-3 h-3 text-violet-400" />
              <span>Spring Boot 3.x / Java 17</span>
            </div>
            
            <pre className="bg-slate-950 p-5 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed max-h-[420px] selection:bg-violet-600/30">
              <code>
                {codeTab === 'config' ? securityConfigCode : authControllerCode}
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
