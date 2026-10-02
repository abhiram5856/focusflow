import React from 'react';
import { UserProgress } from '../../types';

interface MyComputerWindowProps {
  progress: UserProgress;
  onOpenApp: (appId: string) => void;
}

export const MyComputerWindow: React.FC<MyComputerWindowProps> = ({
  progress,
  onOpenApp
}) => {
  const solvedCount = Object.values(progress.solvedProblems).filter(Boolean).length;
  const completedDays = progress.completedDays.length;

  return (
    <div className="flex flex-col h-full bg-white select-text">
      {/* Address Bar */}
      <div className="bg-[#ece9d8] border-b border-[#a09e97] p-1.5 flex items-center gap-2 text-xs select-none">
        <span className="text-gray-500 font-bold">Address</span>
        <div className="flex-1 bg-white border border-[#7f9db9] px-2 py-0.5 rounded text-gray-800 flex items-center gap-1">
          <span>🖥️</span>
          <span>My Computer</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-gray-800 font-sans">
        {/* System Overview */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
          <div className="font-bold text-sm text-blue-900 mb-1 flex items-center gap-2">
            <span>⚙️</span> System Specification & Preparation Summary
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
            <div><strong>OS:</strong> Microsoft Windows XP SP3 (AI Engineer Edition)</div>
            <div><strong>Environment:</strong> React 19 + TypeScript + Tailwind CSS</div>
            <div><strong>Active Curriculum:</strong> 150-Day Simultaneous Multi-Pillar OS</div>
            <div><strong>Persistence:</strong> HTML5 Web Storage (localStorage)</div>
          </div>
        </div>

        {/* Hard Disk Drives */}
        <div>
          <div className="font-bold text-xs uppercase text-gray-600 border-b border-gray-300 pb-1 mb-2 flex items-center gap-1.5">
            <span>💽</span> Hard Disk Drives
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              onClick={() => onOpenApp('dsa-lab')}
              className="p-3 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors shadow-2xs"
            >
              <span className="text-3xl">💽</span>
              <div>
                <div className="font-bold text-xs">DSA Drive (C:)</div>
                <div className="text-[11px] text-gray-500">{solvedCount} Problems Solved</div>
              </div>
            </div>

            <div
              onClick={() => onOpenApp('sql-lab')}
              className="p-3 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors shadow-2xs"
            >
              <span className="text-3xl">💽</span>
              <div>
                <div className="font-bold text-xs">Being Zero SQL (D:)</div>
                <div className="text-[11px] text-gray-500">45 Sequence Topics</div>
              </div>
            </div>

            <div
              onClick={() => onOpenApp('roadmap')}
              className="p-3 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors shadow-2xs"
            >
              <span className="text-3xl">💽</span>
              <div>
                <div className="font-bold text-xs">Backend & Cloud (E:)</div>
                <div className="text-[11px] text-gray-500">Java, Spring, AWS, K8s</div>
              </div>
            </div>

            <div
              onClick={() => onOpenApp('ai-lab')}
              className="p-3 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors shadow-2xs"
            >
              <span className="text-3xl">💽</span>
              <div>
                <div className="font-bold text-xs">AI & GenAI (F:)</div>
                <div className="text-[11px] text-gray-500">Transformers, RAG, MLOps</div>
              </div>
            </div>
          </div>
        </div>

        {/* Removable Storage */}
        <div>
          <div className="font-bold text-xs uppercase text-gray-600 border-b border-gray-300 pb-1 mb-2 flex items-center gap-1.5">
            <span>💾</span> Removable Storage & Projects
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => onOpenApp('progress')}
              className="p-3 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors shadow-2xs"
            >
              <span className="text-3xl">💾</span>
              <div>
                <div className="font-bold text-xs">3½ Floppy (A:) - Streak Ledger</div>
                <div className="text-[11px] text-gray-500">Streak: {progress.currentStreak} Days | Completed: {completedDays}/150 Days</div>
              </div>
            </div>

            <div
              onClick={() => onOpenApp('projects')}
              className="p-3 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors shadow-2xs"
            >
              <span className="text-3xl">💿</span>
              <div>
                <div className="font-bold text-xs">CD-ROM Drive (G:) - 3 Capstone Projects</div>
                <div className="text-[11px] text-gray-500">AI SWE Agent, Enterprise ML, Cloud SRE Agent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
