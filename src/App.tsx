/**
 * FreshCart - Developer Studio & Simulation Workspace
 * File: src/App.tsx
 */

import React, { useState } from 'react';
import { DeviceEmulator } from './components/DeviceEmulator';
import { CodeExplorer } from './components/CodeExplorer';
import { DocCenter } from './components/DocCenter';
import { ChefHat, Code, Layout, ShieldAlert, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'emulator' | 'codebase'>('emulator');

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-zinc-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-all duration-200 relative overflow-hidden">
      
      {/* Decorative Blur Spheres for Glass Depth */}
      <div className="absolute top-[-10%] left-[5%] w-[450px] h-[450px] bg-[#D8F3DC]/30 dark:bg-[#1B4332]/25 rounded-full blur-[110px] pointer-events-none select-none" />
      <div className="absolute bottom-[15%] right-[-5%] w-[550px] h-[550px] bg-amber-100/30 dark:bg-[#F4A261]/10 rounded-full blur-[130px] pointer-events-none select-none" />
      <div className="absolute top-[40%] right-[15%] w-[300px] h-[300px] bg-emerald-100/20 dark:bg-[#40916C]/10 rounded-full blur-[90px] pointer-events-none select-none" />

      {/* Workspace Top Header Banner - Frosted Glass */}
      <header className="bg-white/75 dark:bg-zinc-900/75 border-b border-white/40 dark:border-zinc-800/40 py-4 px-8 sticky top-0 z-40 backdrop-blur-md shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-[#2D6A4F] text-white p-2.5 rounded-xl shadow-lg ring-1 ring-white/20">
            <ChefHat size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#2D6A4F] to-[#40916C] bg-clip-text text-transparent">FreshCart Studio</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D8F3DC]/80 text-[#2D6A4F] border border-[#2D6A4F]/10 backdrop-blur-sm">PROD READY</span>
            </div>
            <p className="text-xs text-gray-400">React Native / Expo Smart Grocery List & AI Recipe Developer Space</p>
          </div>
        </div>

        {/* Workspace Controller Tabs (Mobile responsive quick-switcher) */}
        <div className="flex space-x-2 bg-gray-200/50 dark:bg-zinc-800/50 p-1 rounded-xl border border-white/20 dark:border-zinc-700/20 backdrop-blur-sm">
          <button
            onClick={() => setActiveWorkspaceTab('emulator')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
              activeWorkspaceTab === 'emulator'
                ? 'bg-[#2D6A4F] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Layout size={14} />
            <span>App Simulator</span>
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('codebase')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
              activeWorkspaceTab === 'codebase'
                ? 'bg-[#2D6A4F] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Code size={14} />
            <span>React Native Files</span>
          </button>
        </div>
      </header>

      {/* Main Dual-Column Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Column: Interactive Mobile Frame */}
        <div className={`lg:col-span-5 flex flex-col items-center justify-center space-y-4 ${activeWorkspaceTab === 'emulator' ? 'block' : 'hidden lg:flex'}`}>
          <div className="text-center space-y-1 select-none">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2D6A4F]">Live Simulator View</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Interact with checkout flows, pricing, & AI Chef recipes below.</p>
          </div>

          <DeviceEmulator />
        </div>

        {/* Right Column: Code Explorer & Production Guide */}
        <div className={`lg:col-span-7 space-y-6 ${activeWorkspaceTab === 'codebase' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Section Indicator */}
          <div className="flex items-center space-x-2 text-[#2D6A4F] font-bold text-xs uppercase tracking-wider select-none">
            <Layers size={14} />
            <span>Developer Sandbox & Export Desk</span>
          </div>

          {/* Code Viewer Panel */}
          <div className="h-[520px]">
            <CodeExplorer />
          </div>

          {/* Architecture Documentation Center */}
          <DocCenter />

          {/* Quick Notice about environment constraints */}
          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/30 rounded-xl flex items-start space-x-3 text-xs text-amber-700 dark:text-amber-400 backdrop-blur-md">
            <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-500" />
            <p className="leading-relaxed">
              <strong>Expo Production Ready:</strong> The complete directory of codebase files matches Expo Router standards perfectly. Copy any element directly or integrate with your Expo SDK workflow immediately using the workspace files in the project folder structure.
            </p>
          </div>
        </div>

      </main>

      {/* Footer credits - Frosted Glass */}
      <footer className="bg-white/60 dark:bg-zinc-900/60 border-t border-white/20 dark:border-zinc-800/20 py-6 px-8 text-center text-xs text-gray-400 backdrop-blur-md select-none relative z-10">
        <p>FreshCart developer Workspace — Built for Google AI Studio. Code conforms to iOS-first standards and Tamagui parameters.</p>
      </footer>

    </div>
  );
}
