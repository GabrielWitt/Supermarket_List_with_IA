import React, { useState } from 'react';
import { DEFAULT_CODE_FILES, CodeFile } from '../data/defaultCodeFiles';
import { Folder, File, Copy, Check, Download, Info, Layers, Terminal } from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(DEFAULT_CODE_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([selectedFile.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-[#1E1E1E]/85 text-gray-300 rounded-2xl overflow-hidden shadow-2xl border border-white/10 dark:border-zinc-800/40 backdrop-blur-lg" id="code-explorer-section">
      {/* Tab bar / Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#181818]/60 border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Terminal size={18} className="text-[#2D6A4F]" />
          <span className="font-mono text-sm font-semibold text-gray-200">FreshCart React Native Codebase</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 hover:bg-[#2D2D2D]/60 rounded text-gray-400 hover:text-white transition-colors duration-150"
            title="Copy Code"
          >
            {copied ? <Check size={16} className="text-[#34C759]" /> : <Copy size={16} />}
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 hover:bg-[#2D2D2D]/60 rounded text-gray-400 hover:text-white transition-colors duration-150"
            title="Download File"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar file tree */}
        <div className="w-64 bg-[#151515]/60 border-r border-white/10 p-3 overflow-y-auto font-mono text-xs select-none backdrop-blur-sm">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-3 px-2">Project Workspace</div>
          
          <div className="space-y-1">
            {/* Root Folders */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-400 px-2 py-1">
                <Folder size={14} className="mr-1.5 text-amber-500" />
                <span className="font-semibold text-gray-300">freshcart-expo/</span>
              </div>
 
              {/* Subfolders & Files */}
              <div className="pl-4 space-y-1">
                {DEFAULT_CODE_FILES.map((file) => {
                  const parts = file.path.split('/');
                  const dirName = parts[0];
                  const fileName = parts[1];
                  const isSelected = selectedFile.path === file.path;
 
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`flex items-center w-full text-left px-2 py-1.5 rounded transition-all duration-150 ${
                        isSelected 
                          ? 'bg-[#2D6A4F]/25 text-[#D8F3DC] border-l-2 border-[#2D6A4F]' 
                          : 'hover:bg-[#202020]/50 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <File size={13} className={`mr-1.5 ${isSelected ? 'text-[#34C759]' : 'text-gray-500'}`} />
                      <div className="truncate">
                        <span className="text-[10px] text-gray-500 block leading-tight">{dirName}/</span>
                        <span className="leading-tight">{fileName}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
 
          {/* Architecture Card */}
          <div className="mt-8 p-3 bg-white/5 dark:bg-[#202020]/30 rounded-lg border border-white/10">
            <div className="flex items-center space-x-1 text-[#F4A261] mb-2">
              <Layers size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Architecture Detail</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Implemented with <strong>Clean Architecture</strong>, separating custom types from the reactive Zustand store, using Firebase for cloud sync, and verifying calculations with comprehensive Jest unit tests.
            </p>
          </div>
        </div>
 
        {/* Code editor content pane */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1E1E1E]/50 backdrop-blur-sm">
          {/* File path breadcrumb */}
          <div className="px-4 py-2 bg-[#1A1A1A]/60 text-xs font-mono text-gray-400 border-b border-white/10 flex items-center">
            <span className="text-gray-600">freshcart-expo</span>
            <span className="mx-1.5 text-gray-600">/</span>
            <span>{selectedFile.path}</span>
          </div>
 
          {/* Code text block */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-gray-300">
            <pre className="relative select-text">
              <code>
                {selectedFile.code.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row hover:bg-[#252525]/30">
                    <span className="table-cell text-right pr-4 text-gray-600 select-none w-8">{idx + 1}</span>
                    <span className="table-cell break-all">{line || ' '}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
