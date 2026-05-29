import React, { useState } from 'react';
import { Database, ArrowRight, Code, ListFilter, Server, Shield } from 'lucide-react';

export default function JPAVisualizer() {
  const [activeTab, setActiveTab] = useState('diagram');

  const categoryJavaCode = `package com.shopease.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}`;

  const productJavaCode = `package com.shopease.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private User seller; // Mapped dynamically on Day 4

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(columnDefinition = "TEXT")
    private String images; // JSON Array of URLs
}`;

  const userJavaCode = `package com.shopease.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}`;

  const roleJavaCode = `package com.shopease.model;

/**
 * User system roles defining standard RBAC privileges.
 */
public enum Role {
    BUYER,
    SELLER,
    ADMIN
}`;

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-400 mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Hibernate & Spring Data JPA</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Day 4 Multi-Vendor Schema</h2>
          <p className="text-xs text-slate-400 mt-1">Interactive visualizer mapping the PostgreSQL tables to Java JPA @Entities, featuring user authentication modeling.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'diagram'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Relation Map</span>
          </button>
          <button
            onClick={() => setActiveTab('category-code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'category-code'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Category.java</span>
          </button>
          <button
            onClick={() => setActiveTab('product-code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'product-code'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Product.java</span>
          </button>
          <button
            onClick={() => setActiveTab('user-code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'user-code'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>User.java</span>
          </button>
          <button
            onClick={() => setActiveTab('role-code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'role-code'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Role.java</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'diagram' && (
        <div className="py-4 space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-11 gap-6 items-center">
            
            {/* Category Table Card */}
            <div className="xl:col-span-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-4 hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <span className="text-xs font-mono text-violet-400">TABLE: categories</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">Category</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-emerald-400 font-bold">id : BIGINT</span>
                  <span className="text-slate-500 text-[10px]">PK, AUTOINC</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>name : VARCHAR(100)</span>
                  <span className="text-slate-500 text-[10px]">NOT NULL</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-pink-400">slug : VARCHAR(120)</span>
                  <span className="text-slate-500 text-[10px]">UNIQUE, INDEX</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>description : TEXT</span>
                  <span className="text-slate-500 text-[10px]">NULL</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/60 pt-2">
                  <span className="text-sky-400">parent_id : BIGINT</span>
                  <span className="text-slate-500 text-[10px]">FK (self)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>is_active : BOOLEAN</span>
                  <span className="text-slate-500 text-[10px]">DEFAULT TRUE</span>
                </div>
              </div>

              {/* Self reference badge */}
              <div className="mt-2 p-2 bg-sky-950/20 border border-sky-850 rounded-lg text-[10px] text-sky-400/90 leading-relaxed flex items-start gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-400 mt-1 flex-shrink-0 animate-ping" />
                <span><strong>Hierarchy:</strong> Self-referencing FK enables parent-child category structuring dynamically.</span>
              </div>
            </div>

            {/* Junction Category-Product */}
            <div className="xl:col-span-1 flex xl:flex-col justify-center items-center gap-1.5 text-slate-500 py-2">
              <div className="h-[1px] w-8 xl:w-[1px] xl:h-12 bg-gradient-to-r xl:bg-gradient-to-b from-violet-500 to-indigo-500" />
              <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[8px] font-bold text-slate-450 tracking-wider text-center whitespace-nowrap">
                MANY TO ONE
              </div>
              <div className="h-[1px] w-8 xl:w-[1px] xl:h-12 bg-gradient-to-r xl:bg-gradient-to-b from-indigo-500 to-purple-500" />
            </div>

            {/* Product Table Card */}
            <div className="xl:col-span-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-4 hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <span className="text-xs font-mono text-indigo-400">TABLE: products</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Product</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-emerald-400 font-bold">id : BIGINT</span>
                  <span className="text-slate-500 text-[10px]">PK, AUTOINC</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-sky-400 font-semibold">category_id : BIGINT</span>
                  <span className="text-slate-500 text-[10px]">FK ➔ categories</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-sky-400 font-semibold">seller_id : BIGINT</span>
                  <span className="text-slate-500 text-[10px]">FK ➔ users</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>title : VARCHAR(255)</span>
                  <span className="text-slate-500 text-[10px]">NOT NULL</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-pink-400">slug : VARCHAR(280)</span>
                  <span className="text-slate-500 text-[10px]">UNIQUE, INDEX</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-amber-400 font-semibold">price : NUMERIC(10,2)</span>
                  <span className="text-slate-500 text-[10px]">DECIMAL</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>stock : INTEGER</span>
                  <span className="text-slate-500 text-[10px]">DEFAULT 0</span>
                </div>
              </div>

              {/* Relationship Alert */}
              <div className="mt-2 p-2 bg-indigo-950/20 border border-indigo-850 rounded-lg text-[10px] text-indigo-400/90 leading-relaxed flex items-start gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1 flex-shrink-0 animate-ping" />
                <span><strong>Relational:</strong> Dynamic <code>@ManyToOne</code> mappings link each product to categories & owning sellers.</span>
              </div>
            </div>

            {/* Junction Product-User */}
            <div className="xl:col-span-1 flex xl:flex-col justify-center items-center gap-1.5 text-slate-500 py-2">
              <div className="h-[1px] w-8 xl:w-[1px] xl:h-12 bg-gradient-to-r xl:bg-gradient-to-b from-indigo-500 to-pink-500" />
              <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[8px] font-bold text-slate-450 tracking-wider text-center whitespace-nowrap">
                MANY TO ONE
              </div>
              <div className="h-[1px] w-8 xl:w-[1px] xl:h-12 bg-gradient-to-r xl:bg-gradient-to-b from-pink-500 to-fuchsia-500" />
            </div>

            {/* User Table Card */}
            <div className="xl:col-span-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-4 hover:border-pink-500/30 transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <span className="text-xs font-mono text-pink-400">TABLE: users</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">User</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-emerald-400 font-bold">id : BIGINT</span>
                  <span className="text-slate-500 text-[10px]">PK, AUTOINC</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>name : VARCHAR(100)</span>
                  <span className="text-slate-500 text-[10px]">NOT NULL</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-pink-400">email : VARCHAR(150)</span>
                  <span className="text-slate-500 text-[10px]">UNIQUE, INDEX</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>password_hash : VARCHAR(255)</span>
                  <span className="text-slate-500 text-[10px]">BCRYPT SECURE</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/60 pt-2">
                  <span className="text-fuchsia-400 font-semibold">role : VARCHAR(20)</span>
                  <span className="text-slate-500 text-[10px]">ENUM STRINGS</span>
                </div>
                <div className="flex justify-between items-center text-slate-455">
                  <span>avatar_url : VARCHAR(255)</span>
                  <span className="text-slate-500 text-[10px]">NULLABLE</span>
                </div>
              </div>

              {/* Role enum helper */}
              <div className="mt-2 p-2 bg-pink-950/20 border border-pink-850 rounded-lg text-[10px] text-pink-400/90 leading-relaxed flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 text-pink-400 mt-0.5 flex-shrink-0" />
                <span><strong>Role Enum:</strong> Enforces standard strict roles (<code>BUYER</code>, <code>SELLER</code>, <code>ADMIN</code>) across the database.</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {(activeTab === 'category-code' || activeTab === 'product-code' || activeTab === 'user-code' || activeTab === 'role-code') && (
        <div className="relative">
          <div className="absolute right-4 top-4 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono text-slate-400">
            <Server className="w-3 h-3" />
            <span>Java 17 / Jakarta Persistence</span>
          </div>
          <pre className="bg-slate-950 p-5 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed max-h-[380px]">
            <code>
              {activeTab === 'category-code' && categoryJavaCode}
              {activeTab === 'product-code' && productJavaCode}
              {activeTab === 'user-code' && userJavaCode}
              {activeTab === 'role-code' && roleJavaCode}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
