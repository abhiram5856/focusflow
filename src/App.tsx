import React, { useState } from 'react';
import { WindowState } from './types';
import { useProgress } from './hooks/useProgress';
import { DesktopIcon } from './components/xp/DesktopIcon';
import { XPTaskbar } from './components/xp/XPTaskbar';
import { XPStartMenu } from './components/xp/XPStartMenu';
import { XPWindow } from './components/xp/XPWindow';
import { AuthProvider, useAuth } from './context/AuthContext';
import { XPAuthModal } from './components/xp/XPAuthModal';

// Window Applications
import { RoadmapWindow } from './components/windows/RoadmapWindow';
import { SqlLabWindow } from './components/windows/SqlLabWindow';
import { DsaLabWindow } from './components/windows/DsaLabWindow';
import { ProjectsWindow } from './components/windows/ProjectsWindow';
import { InterviewCenterWindow } from './components/windows/InterviewCenterWindow';
import { ProgressWindow } from './components/windows/ProgressWindow';
import { AiLabWindow } from './components/windows/AiLabWindow';
import { SystemDesignWindow } from './components/windows/SystemDesignWindow';
import { NotepadWindow } from './components/windows/NotepadWindow';
import { SearchWindow } from './components/windows/SearchWindow';
import { SmartRevisionWindow } from './components/windows/SmartRevisionWindow';
import { MyComputerWindow } from './components/windows/MyComputerWindow';

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: 'roadmap',
    title: '150-Day Master Roadmap (Simultaneous Multi-Pillar OS)',
    icon: '📚',
    isOpen: true, // Opened by default to showcase the core curriculum product immediately
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 50, y: 25 },
    size: { width: 1050, height: 680 }
  },
  {
    id: 'dsa-lab',
    title: 'DSA Lab & Pattern Explorer',
    icon: '💻',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 120, y: 50 },
    size: { width: 950, height: 620 }
  },
  {
    id: 'sql-lab',
    title: 'Being Zero SQL Interactive Sandbox',
    icon: '🗄️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 2,
    position: { x: 160, y: 70 },
    size: { width: 980, height: 640 }
  },
  {
    id: 'ai-lab',
    title: 'AI, GenAI & RAG Simulator',
    icon: '🤖',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 3,
    position: { x: 190, y: 80 },
    size: { width: 920, height: 600 }
  },
  {
    id: 'system-design',
    title: 'System Design Studio & Blueprints',
    icon: '⚙️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 4,
    position: { x: 210, y: 90 },
    size: { width: 960, height: 630 }
  },
  {
    id: 'projects',
    title: '3 Production Capstone Projects',
    icon: '🚀',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    position: { x: 230, y: 100 },
    size: { width: 980, height: 640 }
  },
  {
    id: 'interview-center',
    title: 'Interview Center & Question Bank',
    icon: '🎤',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 250, y: 110 },
    size: { width: 940, height: 620 }
  },
  {
    id: 'progress',
    title: 'Preparation Progress & Readiness Analytics',
    icon: '📊',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 180, y: 60 },
    size: { width: 900, height: 600 }
  },
  {
    id: 'notepad',
    title: 'Notepad.exe (Daily Study Scratchpad)',
    icon: '📝',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 280, y: 130 },
    size: { width: 720, height: 500 }
  },
  {
    id: 'search',
    title: 'Global Unified Search',
    icon: '🔍',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 240, y: 80 },
    size: { width: 850, height: 580 }
  },
  {
    id: 'revision',
    title: 'Smart Spaced Repetition Revision',
    icon: '🔁',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 260, y: 90 },
    size: { width: 880, height: 580 }
  },
  {
    id: 'my-computer',
    title: 'My Computer (Virtual Machine Specs)',
    icon: '🖥️',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 100, y: 50 },
    size: { width: 760, height: 520 }
  }
];

function AppContent() {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<string | null>('roadmap');
  const [selectedIconId, setSelectedIconId] = useState<string | null>('roadmap');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState<boolean>(false);
  const [, setTopZIndex] = useState<number>(20);

  const { 
    user, 
    syncStatus, 
    lastSyncedAt, 
    openAuthModal, 
    localStats, 
    showMigrationPrompt, 
    dismissMigrationPrompt, 
    importLocalProgress 
  } = useAuth();

  const {
    progress,
    isDemoMode,
    toggleDemoMode,
    toggleDayCompletion,
    toggleBookmark,
    toggleTask,
    toggleProblemSolved,
    toggleQuestionMastered,
    toggleRevisionItem,
    saveNote,
    addStudyMinutes,
    toggleProjectTask,
    resetAllProgress,
    exportBackup,
    importBackup
  } = useProgress(user?.id);

  const bringToFront = (id: string) => {
    setActiveWindowId(id);
    setTopZIndex(prev => {
      const nextZ = prev + 1;
      setWindows(winList =>
        winList.map(w => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w))
      );
      return nextZ;
    });
  };

  const openApp = (id: string) => {
    setWindows(winList =>
      winList.map(w => {
        if (w.id === id) {
          return { ...w, isOpen: true, isMinimized: false };
        }
        return w;
      })
    );
    bringToFront(id);
  };

  const closeWindow = (id: string) => {
    setWindows(winList =>
      winList.map(w => (w.id === id ? { ...w, isOpen: false } : w))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(winList =>
      winList.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const toggleMaximizeWindow = (id: string) => {
    setWindows(winList =>
      winList.map(w => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
    bringToFront(id);
  };

  const handleTaskbarWindowClick = (id: string) => {
    const targetWin = windows.find(w => w.id === id);
    if (!targetWin) return;

    if (targetWin.isMinimized) {
      setWindows(winList =>
        winList.map(w => (w.id === id ? { ...w, isMinimized: false } : w))
      );
      bringToFront(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      bringToFront(id);
    }
  };

  // Desktop Icons Configuration
  const desktopIcons = [
    { id: 'my-computer', title: 'My Computer', icon: '🖥️' },
    { id: 'roadmap', title: '150-Day Roadmap', icon: '📚', badge: '150' },
    { id: 'dsa-lab', title: 'DSA Lab', icon: '💻' },
    { id: 'sql-lab', title: 'Being Zero SQL', icon: '🗄️' },
    { id: 'ai-lab', title: 'AI & GenAI Lab', icon: '🤖' },
    { id: 'system-design', title: 'System Design', icon: '⚙️' },
    { id: 'projects', title: '3 Capstones', icon: '🚀', badge: '3' },
    { id: 'interview-center', title: 'Interview Center', icon: '🎤' },
    { id: 'progress', title: 'Prep Progress', icon: '📊' },
    { id: 'notepad', title: 'Notepad.exe', icon: '📝' },
    { id: 'search', title: 'Search OS', icon: '🔍' },
    { id: 'revision', title: 'Smart Revision', icon: '🔁' }
  ];

  return (
    <div
      onClick={() => {
        setIsStartMenuOpen(false);
        setSelectedIconId(null);
      }}
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{
        // Authentic Windows XP Bliss Rolling Hills & Sky styling
        background: `radial-gradient(ellipse at 50% 20%, #4a8df8 0%, #1e5fc2 45%, #104294 75%),
                     linear-gradient(180deg, #104294 0%, #297a15 65%, #34941b 85%, #236c11 100%)`,
        backgroundBlendMode: 'screen, normal'
      }}
    >
      {/* Decorative Bliss Cloud & Sun Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.7)_0%,transparent_35%)]" />
      <div className="absolute bottom-9 left-0 right-0 h-44 pointer-events-none bg-gradient-to-t from-[#206911] via-[#2d8c18] to-transparent opacity-90 rounded-t-[100%_40px]" />

      {/* Desktop Icons Container */}
      <div className="absolute top-2 left-2 bottom-12 flex flex-col flex-wrap gap-1 z-0 p-1 pointer-events-auto max-h-[calc(100vh-50px)]">
        {desktopIcons.map(icon => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            title={icon.title}
            icon={icon.icon}
            badge={icon.badge}
            isSelected={selectedIconId === icon.id}
            onSelect={() => setSelectedIconId(icon.id)}
            onOpen={() => openApp(icon.id)}
          />
        ))}
      </div>

      {/* WINDOWS XP WINDOW MANAGER */}
      {windows.map(win => {
        if (!win.isOpen) return null;

        return (
          <XPWindow
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isMaximized={win.isMaximized}
            zIndex={win.zIndex}
            initialPosition={win.position}
            initialSize={win.size}
            onFocus={() => bringToFront(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximizeToggle={() => toggleMaximizeWindow(win.id)}
          >
            {win.id === 'roadmap' && (
              <RoadmapWindow
                progress={progress}
                onToggleComplete={toggleDayCompletion}
                onToggleBookmark={toggleBookmark}
                onToggleTask={toggleTask}
                onSaveNote={saveNote}
                onToggleProblemSolved={toggleProblemSolved}
                onToggleQuestionMastered={toggleQuestionMastered}
              />
            )}

            {win.id === 'sql-lab' && <SqlLabWindow />}

            {win.id === 'dsa-lab' && (
              <DsaLabWindow
                progress={progress}
                onToggleProblemSolved={toggleProblemSolved}
              />
            )}

            {win.id === 'ai-lab' && <AiLabWindow />}

            {win.id === 'system-design' && <SystemDesignWindow />}

            {win.id === 'projects' && (
              <ProjectsWindow
                progress={progress}
                onToggleProjectTask={toggleProjectTask}
              />
            )}

            {win.id === 'interview-center' && (
              <InterviewCenterWindow
                progress={progress}
                onToggleMastered={toggleQuestionMastered}
                onOpenDay={(_d) => {
                  openApp('roadmap');
                }}
              />
            )}

            {win.id === 'progress' && (
              <ProgressWindow
                progress={progress}
                isDemoMode={isDemoMode}
                onToggleDemoMode={toggleDemoMode}
                onAddStudyMinutes={addStudyMinutes}
                onResetProgress={resetAllProgress}
                onExportBackup={exportBackup}
                onImportBackup={importBackup}
                onOpenAuthModal={openAuthModal}
              />
            )}

            {win.id === 'notepad' && (
              <NotepadWindow
                initialNotes={progress.notes}
                onSaveNote={saveNote}
              />
            )}

            {win.id === 'search' && (
              <SearchWindow
                onOpenDay={(_d) => {
                  openApp('roadmap');
                }}
                onOpenApp={openApp}
              />
            )}

            {win.id === 'revision' && (
              <SmartRevisionWindow
                progress={progress}
                onOpenDay={(_d) => {
                  openApp('roadmap');
                }}
                onToggleRevisionItem={toggleRevisionItem}
              />
            )}

            {win.id === 'my-computer' && (
              <MyComputerWindow
                progress={progress}
                onOpenApp={openApp}
              />
            )}
          </XPWindow>
        );
      })}

      {/* XP Start Menu */}
      <XPStartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenApp={openApp}
        onResetProgress={resetAllProgress}
        userEmail={user?.email}
        onOpenAuthModal={openAuthModal}
      />

      {/* XP Taskbar with Cloud Sync and User Account */}
      <XPTaskbar
        windows={windows}
        activeWindowId={activeWindowId}
        streak={progress.currentStreak}
        studyMinutes={progress.studyMinutes}
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen(prev => !prev)}
        onWindowClick={handleTaskbarWindowClick}
        onOpenApp={openApp}
        syncStatus={syncStatus}
        lastSyncedAt={lastSyncedAt}
        userEmail={user?.email}
        onOpenAuthModal={openAuthModal}
      />

      {/* Windows XP User Logon & Cloud Synchronization Modal */}
      <XPAuthModal />

      {/* Existing Local Progress Migration Balloon / Notification */}
      {user && showMigrationPrompt && localStats.hasLocalProgress && (
        <div className="fixed top-3 right-3 z-[60] max-w-sm xp-window border-2 border-[#0055ea] shadow-2xl p-3 bg-[#ffffdf] rounded animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#003c74]">
              <span className="text-base">📦</span>
              <span>Import Existing Local Progress?</span>
            </div>
            <button
              onClick={dismissMigrationPrompt}
              className="text-gray-500 hover:text-black text-xs font-bold px-1 cursor-pointer"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-gray-700 leading-snug mb-2">
            Found <strong>{localStats.completedDaysCount} completed days</strong>,{' '}
            <strong>{localStats.solvedCount} problems</strong>, and{' '}
            <strong>{localStats.notesCount} notes</strong> in your browser's local cache. Import to sync across your phone and other devices?
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={dismissMigrationPrompt}
              className="xp-btn px-2.5 py-1 text-xs cursor-pointer"
            >
              Later
            </button>
            <button
              onClick={async () => {
                const res = await importLocalProgress();
                alert(res.message);
                dismissMigrationPrompt();
              }}
              className="xp-btn px-3 py-1 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-500 cursor-pointer"
            >
              IMPORT EXISTING LOCAL PROGRESS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
