/**
 * FreshCart - Developer Studio & Simulation Workspace
 * File: src/App.tsx
 */

import React from 'react';
import { DeviceEmulator } from './components/DeviceEmulator';
import { LanguageProvider } from './lib/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-zinc-950 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center font-sans transition-all duration-200 relative overflow-hidden">
        
        {/* Decorative Blur Spheres for Glass Depth */}
        <div className="absolute top-[-10%] left-[5%] w-[450px] h-[450px] bg-[#D8F3DC]/30 dark:bg-[#1B4332]/25 rounded-full blur-[110px] pointer-events-none select-none" />
        <div className="absolute bottom-[15%] right-[-5%] w-[550px] h-[550px] bg-amber-100/30 dark:bg-[#F4A261]/10 rounded-full blur-[130px] pointer-events-none select-none" />
        <div className="absolute top-[40%] right-[15%] w-[300px] h-[300px] bg-emerald-100/20 dark:bg-[#40916C]/10 rounded-full blur-[90px] pointer-events-none select-none" />

        {/* Root Application View */}
        <DeviceEmulator />

      </div>
    </LanguageProvider>
  );
}
