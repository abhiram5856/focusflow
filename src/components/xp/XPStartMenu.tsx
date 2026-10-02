import React from 'react';

interface XPStartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: string) => void;
  onResetProgress: () => void;
  userEmail?: string | null;
  onOpenAuthModal?: () => void;
}

export const XPStartMenu: React.FC<XPStartMenuProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  onResetProgress,
  userEmail,
  onOpenAuthModal
}) => {
  if (!isOpen) return null;

  const handleAppClick = (appId: string) => {
    onOpenApp(appId);
    onClose();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-9 left-0 w-80 sm:w-96 rounded-t-lg overflow-hidden shadow-2xl z-50 border-2 border-[#0055ea] flex flex-col font-sans select-none animate-in fade-in slide-in-from-bottom-2 duration-100"
      style={{
        boxShadow: '4px -4px 16px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Top Banner with User Avatar */}
      <div 
        onClick={() => {
          if (onOpenAuthModal) onOpenAuthModal();
          onClose();
        }}
        className="bg-gradient-to-r from-[#0055ea] via-[#246dfa] to-[#0055ea] p-2.5 flex items-center gap-3 text-white border-b-2 border-[#e68b2c] cursor-pointer hover:brightness-105"
        title="Click to manage account & cloud sync"
      >
        <div className="w-10 h-10 rounded-full border-2 border-white bg-amber-400 flex items-center justify-center text-xl shadow">
          👨‍💻
        </div>
        <div className="overflow-hidden flex-1">
          <div className="font-bold text-sm text-white drop-shadow truncate">
            {userEmail ? userEmail.split('@')[0].toUpperCase() : 'AI_ENGINEER_CANDIDATE'}
          </div>
          <div className="text-[11px] text-blue-100 flex items-center justify-between">
            <span>{userEmail ? userEmail : '150-Day Prep OS • Administrator'}</span>
            <span className="text-[10px] bg-blue-900/50 px-1 rounded">Sync ⚙</span>
          </div>
        </div>
      </div>

      {/* Two Column Menu Body */}
      <div className="flex h-96 border-b border-[#a09e97]">
        {/* Left Column: Core Preparation Apps (White BG) */}
        <div className="w-1/2 bg-white p-2 flex flex-col gap-1 overflow-y-auto border-r border-[#d4d0c8]">
          <div className="text-[10px] font-bold text-gray-500 uppercase px-1 mb-0.5">Core Curriculum</div>

          <button
            onClick={() => handleAppClick('roadmap')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-gray-800 transition-colors"
          >
            <span className="text-lg">📚</span>
            <div>
              <div className="font-bold">150-Day Roadmap</div>
              <div className="text-[10px] opacity-75">All daily pillars</div>
            </div>
          </button>

          <button
            onClick={() => handleAppClick('dsa-lab')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-gray-800 transition-colors"
          >
            <span className="text-lg">💻</span>
            <div>
              <div className="font-bold">DSA Lab</div>
              <div className="text-[10px] opacity-75">Pattern Visualizer</div>
            </div>
          </button>

          <button
            onClick={() => handleAppClick('sql-lab')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-gray-800 transition-colors"
          >
            <span className="text-lg">🗄️</span>
            <div>
              <div className="font-bold">SQL Lab</div>
              <div className="text-[10px] opacity-75">Being Zero Sandbox</div>
            </div>
          </button>

          <button
            onClick={() => handleAppClick('ai-lab')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-gray-800 transition-colors"
          >
            <span className="text-lg">🤖</span>
            <div>
              <div className="font-bold">AI & GenAI Lab</div>
              <div className="text-[10px] opacity-75">RAG & Agent Engine</div>
            </div>
          </button>

          <button
            onClick={() => handleAppClick('system-design')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-gray-800 transition-colors"
          >
            <span className="text-lg">⚙️</span>
            <div>
              <div className="font-bold">System Design</div>
              <div className="text-[10px] opacity-75">HLD/LLD Architect</div>
            </div>
          </button>

          <button
            onClick={() => handleAppClick('projects')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-gray-800 transition-colors"
          >
            <span className="text-lg">🚀</span>
            <div>
              <div className="font-bold">3 Capstones</div>
              <div className="text-[10px] opacity-75">Production Projects</div>
            </div>
          </button>

          <button
            onClick={() => handleAppClick('interview-center')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-gray-800 transition-colors"
          >
            <span className="text-lg">🎤</span>
            <div>
              <div className="font-bold">Interview Center</div>
              <div className="text-[10px] opacity-75">Question Bank</div>
            </div>
          </button>

          <button
            onClick={() => handleAppClick('notepad')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-gray-800 transition-colors"
          >
            <span className="text-lg">📝</span>
            <div>
              <div className="font-bold">Notepad.exe</div>
              <div className="text-[10px] opacity-75">Daily study notes</div>
            </div>
          </button>
        </div>

        {/* Right Column: System Tools & Analytics (Pale Blue BG) */}
        <div className="w-1/2 bg-[#d3e5fa] p-2 flex flex-col gap-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-[#00138c] uppercase px-1 mb-0.5">Operating System</div>

          <button
            onClick={() => handleAppClick('my-computer')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-[#00138c] transition-colors"
          >
            <span className="text-lg">🖥️</span>
            <div>
              <div className="font-bold">My Computer</div>
              <div className="text-[10px] opacity-75">System Specs & Specs</div>
            </div>
          </button>

          <button
            onClick={() => handleAppClick('progress')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-[#00138c] transition-colors"
          >
            <span className="text-lg">📊</span>
            <div>
              <div className="font-bold">Prep Progress</div>
              <div className="text-[10px] opacity-75">Track Readiness</div>
            </div>
          </button>

          <button
            onClick={() => handleAppClick('search')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-[#00138c] transition-colors"
          >
            <span className="text-lg">🔍</span>
            <div>
              <div className="font-bold">Global Search</div>
              <div className="text-[10px] opacity-75">Topics & Questions</div>
            </div>
          </button>

          <button
            onClick={() => handleAppClick('revision')}
            className="w-full text-left p-1.5 rounded hover:bg-[#2f71eb] hover:text-white flex items-center gap-2 text-xs text-[#00138c] transition-colors"
          >
            <span className="text-lg">🔁</span>
            <div>
              <div className="font-bold">Smart Revision</div>
              <div className="text-[10px] opacity-75">Spaced Repetition</div>
            </div>
          </button>

          <div className="mt-auto pt-2 border-t border-[#b2cdec]">
            <button
              onClick={() => {
                onResetProgress();
                onClose();
              }}
              className="w-full text-left p-1.5 rounded hover:bg-red-600 hover:text-white flex items-center gap-2 text-xs text-red-700 transition-colors"
            >
              <span className="text-base">⚠️</span>
              <div>
                <div className="font-bold">Reset Progress</div>
                <div className="text-[10px] opacity-75">Clear localStorage</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Log Off / Shut Down Bar */}
      <div className="bg-[#245edb] p-2 flex items-center justify-between text-white text-xs">
        <button
          onClick={() => {
            if (onOpenAuthModal) onOpenAuthModal();
            onClose();
          }}
          className="flex items-center gap-1.5 hover:bg-white/20 px-2 py-1 rounded cursor-pointer"
        >
          <span className="text-amber-300">🔑</span>
          <span>{userEmail ? 'Log Off' : 'Log On'}</span>
        </button>
        <button
          onClick={() => {
            alert('Windows XP 150-Day Prep OS will remain active in your browser. All progress is safely persisted to localStorage.');
            onClose();
          }}
          className="flex items-center gap-1.5 hover:bg-white/20 px-2 py-1 rounded cursor-pointer"
        >
          <span className="text-red-400">⏻</span>
          <span>Turn Off Computer</span>
        </button>
      </div>
    </div>
  );
};
