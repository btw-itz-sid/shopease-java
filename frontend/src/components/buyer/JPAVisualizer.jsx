import React, { useState } from 'react';
import { Database, ArrowRight, Code, ListFilter, Server, FileText } from 'lucide-react';

export default function JPAVisualizer() {
  const [activeTab, setActiveTab] = useState('diagram');

  const categoryJavaCode = `package com.shopease.model;

@Entity
@Table(name = "categories")
@Data
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
    private Boolean isActive = true;
}`;

  const productJavaCode = `package com.shopease.model;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seller_id")
    private Long sellerId; // Will become User relation on Day 4

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

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-400 mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Hibernate & Spring Data JPA</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Day 3 Entity Relationship Mapping</h2>
          <p className="text-xs text-slate-400 mt-1">Interactive visualizer mapping the PostgreSQL tables to Java JPA @Entities.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-center">
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
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'diagram' && (
        <div className="py-4 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-center">
            {/* Category Table Card */}
            <div className="lg:col-span-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-4 hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <span className="text-xs font-mono text-violet-400">TABLE: categories</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">@Entity</span>
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
                <div className="flex justify-between items-center text-slate-400">
                  <span>image_url : VARCHAR(255)</span>
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
                <span><strong>Self-Referencing FK:</strong> Enables clean multi-tier catalog structure (e.g. Electronics → Audio & Acoustics).</span>
              </div>
            </div>

            {/* Junction / Relationship Indicator */}
            <div className="lg:col-span-1 flex lg:flex-col justify-center items-center gap-2 text-slate-500 py-2">
              <div className="h-[1px] w-8 lg:w-[1px] lg:h-12 bg-gradient-to-r lg:bg-gradient-to-b from-violet-500 to-indigo-500" />
              <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400 tracking-wider text-center">
                MANY TO ONE
              </div>
              <div className="h-[1px] w-8 lg:w-[1px] lg:h-12 bg-gradient-to-r lg:bg-gradient-to-b from-indigo-500 to-purple-500" />
            </div>

            {/* Product Table Card */}
            <div className="lg:col-span-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-4 hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <span className="text-xs font-mono text-indigo-400">TABLE: products</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">@Entity</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-emerald-400 font-bold">id : BIGINT</span>
                  <span className="text-slate-500 text-[10px]">PK, AUTOINC</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 border-b border-slate-800/60 pb-2">
                  <span className="text-sky-400 font-semibold">category_id : BIGINT</span>
                  <span className="text-slate-500 text-[10px]">FK ➜ categories</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>title : VARCHAR(255)</span>
                  <span className="text-slate-500 text-[10px]">NOT NULL</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-pink-400">slug : VARCHAR(280)</span>
                  <span className="text-slate-500 text-[10px]">UNIQUE, INDEX</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>description : TEXT</span>
                  <span className="text-slate-500 text-[10px]">NULL</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-amber-400 font-semibold">price : NUMERIC(10,2)</span>
                  <span className="text-slate-500 text-[10px]">MONETARY PRECISION</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>stock : INTEGER</span>
                  <span className="text-slate-500 text-[10px]">DEFAULT 0</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>images : TEXT (JSON)</span>
                  <span className="text-slate-500 text-[10px]">NULL</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>seller_id : BIGINT</span>
                  <span className="text-slate-500 text-[10px]">TEMP PLAIN</span>
                </div>
              </div>

              {/* Relationship Alert */}
              <div className="mt-2 p-2 bg-indigo-950/20 border border-indigo-850 rounded-lg text-[10px] text-indigo-400/90 leading-relaxed flex items-start gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1 flex-shrink-0 animate-ping" />
                <span><strong>Relational mapping:</strong> <code>@ManyToOne</code> using Lazy Fetch prevents unnecessary data queries during index listings.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'category-code' || activeTab === 'product-code') && (
        <div className="relative">
          <div className="absolute right-4 top-4 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono text-slate-400">
            <Server className="w-3 h-3" />
            <span>Java 17 / Jakarta Persistence</span>
          </div>
          <pre className="bg-slate-950 p-5 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed max-h-[350px]">
            <code>
              {activeTab === 'category-code' ? categoryJavaCode : productJavaCode}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
