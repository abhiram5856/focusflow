import React, { useState, useEffect } from 'react';
import { WindowState } from '../../types';

import { SyncStatus } from '../../storage/syncManager';

interface XPTaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  streak: number;
  studyMinutes: number;
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onWindowClick: (id: string) => void;
  onOpenApp: (id: string) => void;
  syncStatus?: SyncStatus;
  lastSyncedAt?: Date;
  userEmail?: string | null;
  onOpenAuthModal?: () => void;
}

export const XPTaskbar: React.FC<XPTaskbarProps> = ({
  windows,
  activeWindowId,
  streak,
  studyMinutes,
  isStartMenuOpen,
  onToggleStartMenu,
  onWindowClick,
  onOpenApp,
  syncStatus = 'unconfigured',
  lastSyncedAt,
  userEmail,
  onOpenAuthModal
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const openWindows = windows.filter(w => w.isOpen);

  return (
    <div className="xp-taskbar fixed bottom-0 left-0 right-0 h-9 z-50 flex items-center justify-between select-none">
      {/* Left side: Green Start Button & Running Window buttons */}
      <div className="flex items-center h-full gap-1 overflow-x-auto overflow-y-hidden max-w-[80vw]">
        {/* Start Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStartMenu();
          }}
          className={`xp-start-btn h-full px-3.5 flex items-center gap-1.5 cursor-pointer text-white font-black italic tracking-wide text-sm ${
            isStartMenuOpen ? 'active' : ''
          }`}
        >
          <span className="text-base not-italic">⊞</span>
          <span>start</span>
        </button>

        {/* Quick Launch Icons */}
        <div className="hidden sm:flex items-center px-1 border-r border-[#1941a5] gap-1 shrink-0">
          <button
            onClick={() => onOpenApp('roadmap')}
            title="150-Day Roadmap"
            className="p-1 hover:bg-white/20 rounded cursor-pointer text-sm"
          >
            📚
          </button>
          <button
            onClick={() => onOpenApp('progress')}
            title="Preparation Progress"
            className="p-1 hover:bg-white/20 rounded cursor-pointer text-sm"
          >
            📊
          </button>
          <button
            onClick={() => onOpenApp('notepad')}
            title="Notepad.exe"
            className="p-1 hover:bg-white/20 rounded cursor-pointer text-sm"
          >
            📝
          </button>
        </div>

        {/* Open Windows Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto h-full py-0.5">
          {openWindows.map(win => {
            const isActive = win.id === activeWindowId && !win.isMinimized;
            return (
              <button
                key={win.id}
                onClick={() => onWindowClick(win.id)}
                className={`xp-task-item h-full px-2.5 flex items-center gap-1.5 max-w-[170px] truncate text-xs cursor-pointer ${
                  isActive ? 'active font-bold border border-[#0d2a6b]' : 'border border-[#388cf5]'
                }`}
              >
                <span className="text-sm shrink-0">{win.icon}</span>
                <span className="truncate text-white drop-shadow-sm">{win.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: System Tray */}
      <div className="bg-[#0c59cc] border-l border-[#1941a5] h-full px-2.5 flex items-center gap-2.5 text-white text-xs shadow-inner shrink-0">
        {/* Streak Counter */}
        <div
          onClick={() => onOpenApp('progress')}
          title={`Current Streak: ${streak} Days! Keep it burning!`}
          className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-red-600 px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer hover:brightness-110 shadow"
        >
          <span>🔥</span>
          <span>{streak}d</span>
        </div>

        {/* Study Hours */}
        <div
          title={`Total Study Time: ${Math.floor(studyMinutes / 60)}h ${studyMinutes % 60}m`}
          className="hidden md:flex items-center gap-1 text-[11px] text-blue-100"
        >
          <span>⏱️</span>
          <span>{Math.floor(studyMinutes / 60)}h</span>
        </div>

        {/* Retro Cloud Sync Indicator */}
        <div
          onClick={onOpenAuthModal}
          title={
            syncStatus === 'synced'
              ? `Cloud Synchronized (${lastSyncedAt ? 'Last sync: ' + lastSyncedAt.toLocaleTimeString() : 'Up to date'})`
              : syncStatus === 'syncing' || syncStatus === 'pending'
              ? 'Synchronizing progress with Supabase...'
              : syncStatus === 'offline'
              ? 'Offline — saved in local cache (will sync when online)'
              : syncStatus === 'error'
              ? 'Sync issue — click to view'
              : 'Local Cache Mode (Click to connect cloud sync)'
          }
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
            syncStatus === 'synced'
              ? 'bg-[#107c41] text-white hover:brightness-110 shadow-xs'
              : syncStatus === 'syncing' || syncStatus === 'pending'
              ? 'bg-[#0078d7] text-white animate-pulse'
              : syncStatus === 'offline'
              ? 'bg-[#d83b01] text-white shadow-xs'
              : syncStatus === 'error'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-white/15 text-blue-100 hover:bg-white/25'
          }`}
        >
          <span>
            {syncStatus === 'synced' && '●'}
            {(syncStatus === 'syncing' || syncStatus === 'pending') && '↻'}
            {syncStatus === 'offline' && '⚠'}
            {syncStatus === 'error' && '✕'}
            {syncStatus === 'unconfigured' && '○'}
          </span>
          <span className="hidden sm:inline">
            {syncStatus === 'synced' && 'Synced'}
            {(syncStatus === 'syncing' || syncStatus === 'pending') && 'Syncing...'}
            {syncStatus === 'offline' && 'Offline'}
            {syncStatus === 'error' && 'Error'}
            {syncStatus === 'unconfigured' && 'Local'}
          </span>
        </div>

        {/* User Account / Logon Button */}
        <button
          onClick={onOpenAuthModal}
          title={userEmail ? `Signed in as ${userEmail}` : 'Log on to sync progress across Laptop 1, Laptop 2 & Phone'}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/20 cursor-pointer text-white text-[11px]"
        >
          <span>👤</span>
          <span className="hidden xl:inline max-w-[80px] truncate">
            {userEmail ? userEmail.split('@')[0] : 'Log On'}
          </span>
        </button>

        {/* Network & Audio status */}
        <span title="Local Network Connected" className="cursor-default text-xs">📶</span>
        <span title="System Audio On" className="cursor-default text-xs">🔊</span>

        {/* Real-time Clock */}
        <div className="text-[11px] font-semibold tracking-wider border-l border-[#2465df] pl-2 text-white">
          {time || '12:00 PM'}
        </div>
      </div>
    </div>
  );
};
