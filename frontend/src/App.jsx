import React from 'react';
import { Sparkles, CheckCircle2, ChevronRight, Github, Server, Database, Layout } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans antialiased">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              ShopEase
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              <Github className="w-4 h-4" />
              <span>Repository</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 flex flex-col justify-center relative z-10 w-full">
        {/* Welcome Section */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Redesign Environment Initialized</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Next-Gen Multi-Vendor <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              E-Commerce Platform
            </span>
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            A production-ready full-stack application built with React, Spring Boot, and PostgreSQL. Day 1 & 2 setup is fully completed.
          </p>
        </div>

        {/* Status Dashboard */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Backend Setup */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4 hover:border-slate-700/60 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Server className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Java Spring Boot</h3>
              <p className="text-xs text-slate-400 mt-1">Backend Initialized successfully with Java 17 and Spring Boot 3.x</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Day 1 Complete</span>
            </div>
          </div>

          {/* Card 2: DB Connection */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4 hover:border-slate-700/60 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
              <Database className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">PostgreSQL Config</h3>
              <p className="text-xs text-slate-400 mt-1">HikariPool connected successfully to database on port 9508</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Day 2 Complete</span>
            </div>
          </div>

          {/* Card 3: Frontend Setup */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4 hover:border-slate-700/60 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Layout className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">React + Vite + Tailwind</h3>
              <p className="text-xs text-slate-400 mt-1">Aesthetic layout structure and modern assets configuration set up</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Frontend Day 1 Complete</span>
            </div>
          </div>
        </div>

        {/* Future Days Progress */}
        <div className="mt-10 bg-slate-900/20 border border-slate-800/60 rounded-2xl p-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <span>Next Target: Day 3</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </h4>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="space-y-1">
              <p className="text-sm text-slate-200 font-medium">Categories & Products Entities</p>
              <p className="text-xs text-slate-400">Implement JPA Entities with database relationships & display mock listing on the UI</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-xs font-medium text-white transition-all shadow-md shadow-violet-600/20 duration-200 hover:-translate-y-0.5">
              Let's Proceed
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 ShopEase. Built with passion & clean architecture.</p>
      </footer>
    </div>
  );
}

export default App;
