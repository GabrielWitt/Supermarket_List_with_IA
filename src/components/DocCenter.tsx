import React from 'react';
import { Terminal, Shield, Zap, Sparkles, Code, CheckCircle, Database } from 'lucide-react';

export const DocCenter: React.FC = () => {
  return (
    <div className="bg-white/65 dark:bg-zinc-900/65 rounded-2xl p-6 border border-white/45 dark:border-zinc-800/45 shadow-xl backdrop-blur-lg space-y-6" id="documentation-section">
      <div className="flex items-center space-x-2 border-b border-gray-150/40 dark:border-zinc-800/40 pb-3">
        <Shield size={20} className="text-[#2D6A4F]" />
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">FreshCart Production Architecture</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="p-4 bg-white/40 dark:bg-[#1B4332]/5 rounded-xl border border-[#2D6A4F]/15 dark:border-[#2D6A4F]/10 space-y-2 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-[#2D6A4F] font-bold text-xs uppercase tracking-wider">
            <Zap size={14} />
            <span>State Management</span>
          </div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Zustand Store Engine</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            The reactive core lives in a decentralized state container. Handles shopping metrics aggregation and implements critical business logic safely.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-4 bg-[#D8F3DC]/30 dark:bg-[#1B4332]/10 rounded-xl border border-[#2D6A4F]/25 space-y-2 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-[#2D6A4F] font-bold text-xs uppercase tracking-wider">
            <Database size={14} />
            <span>Durable Persistence</span>
          </div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Firebase Firestore</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Automatic back-end data replication syncing current shopping lists and completed purchase logs on multi-device mobile profiles instantly.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-4 bg-white/40 dark:bg-[#1B4332]/5 rounded-xl border border-[#2D6A4F]/15 dark:border-[#2D6A4F]/10 space-y-2 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-[#2D6A4F] font-bold text-xs uppercase tracking-wider">
            <Code size={14} />
            <span>Clean Codebases</span>
          </div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Tamagui & Expo</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Constructed with precompiled component layout primitives conforming exactly to the light/dark mode color tokens and responsive grid structures.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Active Business Rule Alignments</h3>
        
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-start space-x-2.5">
            <CheckCircle size={14} className="text-[#2D6A4F] shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800 dark:text-gray-200 font-bold">Rule A: Initial State Integrity</strong> — New items added are securely injected with quantity value of 0 and unit price set at exactly $0.00.
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <CheckCircle size={14} className="text-[#2D6A4F] shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800 dark:text-gray-200 font-bold">Rule B: Pricing & Quantity Modals</strong> — Interactive triggers open bottom-sheet editor modals, isolating numeric keyboard interactions on mobile platforms.
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <CheckCircle size={14} className="text-[#2D6A4F] shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800 dark:text-gray-200 font-bold">Rule C: Finish Shopping Calculations</strong> — Dynamically processes aggregation models (Total = qty × price), committing purchased elements to log databases, while leaving quantity 0 elements untouched on the shopping list.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/5 dark:bg-zinc-950/40 p-4 rounded-xl font-mono text-xs text-gray-600 dark:text-gray-400 space-y-2 border border-white/20 dark:border-zinc-800/40 backdrop-blur-sm">
        <div className="flex items-center space-x-1.5 text-gray-800 dark:text-gray-200 mb-1 font-bold">
          <Terminal size={14} />
          <span>Execution Commands</span>
        </div>
        <p className="text-[10px] leading-relaxed">
          # Install production expo SDK 57 compatible dependencies & peer dependencies<br />
          <span className="text-[#2D6A4F]">npx expo install react-native-gesture-handler react-native-svg @react-native-async-storage/async-storage react-native-safe-area-context zustand firebase lucide-react-native phosphor-react-native</span>
        </p>
        <p className="text-[10px] leading-relaxed">
          # Run the unit test suite verifying calculations<br />
          <span className="text-[#2D6A4F]">npm run test tests/grocery.test.ts</span>
        </p>
      </div>
    </div>
  );
};
