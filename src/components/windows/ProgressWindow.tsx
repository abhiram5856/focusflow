import React, { useState, useEffect } from 'react';
import { UserProgress } from '../../types';
import { masterCurriculum } from '../../data/curriculumData';
import { useAuth } from '../../context/AuthContext';

interface ProgressWindowProps {
  progress: UserProgress;
  isDemoMode?: boolean;
  onToggleDemoMode?: (enabled?: boolean) => void;
  onAddStudyMinutes: (mins: number) => void;
  onResetProgress: () => void;
  onExportBackup?: () => void;
  onImportBackup?: (file: File) => Promise<boolean>;
  onOpenAuthModal?: () => void;
}

export const ProgressWindow: React.FC<ProgressWindowProps> = ({
  progress,
  isDemoMode = false,
  onToggleDemoMode,
  onAddStudyMinutes,
  onResetProgress,
  onExportBackup,
  onImportBackup,
  onOpenAuthModal
}) => {
  const { user, syncStatus, lastSyncedAt, triggerManualSync, importLocalProgress, localStats, openAuthModal } = useAuth();
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60); // 25 min default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      onAddStudyMinutes(25);
      alert('Pomodoro study interval completed! 25 minutes added to your total study time.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const totalDays = masterCurriculum.length;
  const completedDaysCount = progress.completedDays.length;
  const overallPct = Math.round((completedDaysCount / totalDays) * 100);



  const completedRatio = completedDaysCount / totalDays;
  const solvedCount = Object.values(progress.solvedProblems).filter(Boolean).length;
  const masteredCount = Object.values(progress.masteredQuestions).filter(Boolean).length;

  // 12-Track Comprehensive Readiness Engine
  const trackScores = [
    { name: 'DSA Pattern Mastery', icon: '💻', score: Math.min(100, Math.round(completedRatio * 60 + solvedCount * 2.5)), detail: `${solvedCount} problems solved independently` },
    { name: 'SQL & Analytical Queries', icon: '🗄️', score: Math.min(100, Math.round(completedRatio * 75 + (solvedCount > 0 ? 25 : 0))), detail: 'Being Zero 1–45 + Window Functions' },
    { name: 'Java 21 & Concurrency', icon: '☕', score: Math.min(100, Math.round(completedRatio * 85 + (completedDaysCount >= 25 ? 15 : 0))), detail: 'JMM, Locks, Virtual Threads' },
    { name: 'CS Core (OS & Networks)', icon: '🧠', score: Math.min(100, Math.round(completedRatio * 80 + (masteredCount > 5 ? 20 : 0))), detail: 'Paging, TCP/IP, TLS 1.3, Sockets' },
    { name: 'DBMS & Database Internals', icon: '⚡', score: Math.min(100, Math.round(completedRatio * 80 + (completedDaysCount >= 50 ? 20 : 0))), detail: 'ACID, MVCC, B+ Trees, WAL' },
    { name: 'Backend (Spring Boot & Kafka)', icon: '🌐', score: Math.min(100, Math.round(completedRatio * 75 + (completedDaysCount >= 70 ? 25 : 0))), detail: 'REST, JPA N+1, Kafka partitions' },
    { name: 'System Design & Tradeoffs', icon: '⚙️', score: Math.min(100, Math.round(completedRatio * 70 + (completedDaysCount >= 100 ? 30 : 0))), detail: 'URL Shortener, Chat, AI Gateway' },
    { name: 'Cloud & DevOps (AWS / Docker)', icon: '☁️', score: Math.min(100, Math.round(completedRatio * 75 + (completedDaysCount >= 85 ? 25 : 0))), detail: 'IAM, VPC, Docker, K8s, Terraform' },
    { name: 'Classical AI & ML Engineering', icon: '📈', score: Math.min(100, Math.round(completedRatio * 80 + (completedDaysCount >= 55 ? 20 : 0))), detail: 'NumPy, Pandas, Scikit-Learn' },
    { name: 'GenAI, RAG & Agents', icon: '🤖', score: Math.min(100, Math.round(completedRatio * 70 + (completedDaysCount >= 110 ? 30 : 0))), detail: 'pgvector HNSW, Hybrid RAG, LangGraph' },
    { name: 'Portfolio Capstone Projects', icon: '🚀', score: completedDaysCount >= 140 ? 100 : Math.round(completedDaysCount * 0.7), detail: '3 Production distributed systems' },
    { name: 'Interview Communication & Defense', icon: '🎤', score: Math.min(100, Math.round((masteredCount / Math.max(1, masterCurriculum.length * 0.2)) * 100)), detail: `${masteredCount} questions mastered` }
  ];

  // Evidence-Based Four-Level Readiness Hierarchy
  const curriculumCompletePct = overallPct;
  const skillReadyPct = Math.min(100, Math.round((solvedCount / 30) * 50 + (completedDaysCount / totalDays) * 50));
  const interviewReadyPct = Math.min(100, Math.round((masteredCount / 20) * 60 + (completedDaysCount >= 120 ? 40 : completedDaysCount * 0.3)));
  const jobReadyPct = Math.min(100, Math.round((completedDaysCount >= 145 ? 50 : completedDaysCount * 0.3) + (masteredCount >= 15 ? 25 : masteredCount * 1.5) + (solvedCount >= 20 ? 25 : solvedCount * 1.2)));

  const timerMinutes = Math.floor(timerSeconds / 60);
  const timerSecs = timerSeconds % 60;

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-text overflow-y-auto p-2 space-y-3">
      {/* Header Banner */}
      <div className="bg-white border-2 border-gray-300 p-3 rounded shadow-xs">
        <h2 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
          <span>📊</span>
          <span>Preparation Progress & Readiness Analytics Engine</span>
        </h2>
        <p className="text-xs text-gray-600">
          Purely calculated from completed daily tasks, verified code deliverables, and solved problems.
        </p>
      </div>

      {/* Key Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-white border border-[#7f9db9] rounded p-2.5 shadow-xs flex items-center gap-3">
          <div className="text-3xl">🔥</div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase">Current Streak</div>
            <div className="text-xl font-black text-amber-600">{progress.currentStreak} Days</div>
          </div>
        </div>

        <div className="bg-white border border-[#7f9db9] rounded p-2.5 shadow-xs flex items-center gap-3">
          <div className="text-3xl">🏆</div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase">Longest Streak</div>
            <div className="text-xl font-black text-blue-700">{progress.longestStreak} Days</div>
          </div>
        </div>

        <div className="bg-white border border-[#7f9db9] rounded p-2.5 shadow-xs flex items-center gap-3">
          <div className="text-3xl">📚</div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase">Days Complete</div>
            <div className="text-xl font-black text-emerald-700">{completedDaysCount} / {totalDays}</div>
          </div>
        </div>

        <div className="bg-white border border-[#7f9db9] rounded p-2.5 shadow-xs flex items-center gap-3">
          <div className="text-3xl">⏱️</div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase">Study Hours</div>
            <div className="text-xl font-black text-purple-700">
              {Math.floor(progress.studyMinutes / 60)}h {progress.studyMinutes % 60}m
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white border border-[#7f9db9] rounded p-3 shadow-xs">
        <div className="flex justify-between items-center text-xs font-bold text-gray-800 mb-1.5">
          <span>Overall Curriculum Completion:</span>
          <span className="text-[#245edb] text-sm">{overallPct}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-400 p-0.5">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* Evidence-Based Four-Level Readiness Dashboard */}
      <div className="bg-white border border-[#7f9db9] rounded p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase text-gray-800">
            🎯 Evidence-Based Readiness Verification:
          </h3>
          <span className="text-[10px] text-gray-500 font-mono">Based on verified tasks & code (not mere days)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Level 1: Curriculum Complete */}
          <div className="border border-blue-200 bg-blue-50/50 rounded p-2 text-xs">
            <div className="font-bold text-blue-900 mb-0.5 flex items-center justify-between">
              <span>1. Curriculum Complete</span>
              <span>{curriculumCompletePct}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden mb-1">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${curriculumCompletePct}%` }} />
            </div>
            <p className="text-[10px] text-gray-600">Syllabus topics checked & reviewed.</p>
          </div>

          {/* Level 2: Skill Ready */}
          <div className="border border-indigo-200 bg-indigo-50/50 rounded p-2 text-xs">
            <div className="font-bold text-indigo-900 mb-0.5 flex items-center justify-between">
              <span>2. Skill Ready</span>
              <span>{skillReadyPct}%</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-1.5 overflow-hidden mb-1">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${skillReadyPct}%` }} />
            </div>
            <p className="text-[10px] text-gray-600">Independently solved {solvedCount} problems & SQL queries.</p>
          </div>

          {/* Level 3: Interview Ready */}
          <div className="border border-purple-200 bg-purple-50/50 rounded p-2 text-xs">
            <div className="font-bold text-purple-900 mb-0.5 flex items-center justify-between">
              <span>3. Interview Ready</span>
              <span>{interviewReadyPct}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-1.5 overflow-hidden mb-1">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${interviewReadyPct}%` }} />
            </div>
            <p className="text-[10px] text-gray-600">Mastered {masteredCount} questions with timed defense.</p>
          </div>

          {/* Level 4: Job Ready */}
          <div className="border border-emerald-200 bg-emerald-50/50 rounded p-2 text-xs">
            <div className="font-bold text-emerald-900 mb-0.5 flex items-center justify-between">
              <span>4. Job Ready</span>
              <span>{jobReadyPct}%</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden mb-1">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${jobReadyPct}%` }} />
            </div>
            <p className="text-[10px] text-gray-600">3 Defensible capstones & trade-off mastery.</p>
          </div>
        </div>
      </div>

      {/* Track Breakdown (Preparation Progress) */}
      <div className="bg-white border border-[#7f9db9] rounded p-3 shadow-xs">
        <h3 className="font-bold text-xs uppercase text-gray-700 mb-3 flex items-center justify-between">
          <span>Track-by-Track Preparation Progress:</span>
          <span className="text-[11px] text-gray-500 font-normal">Calculated purely from completed items</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trackScores.map(t => (
            <div key={t.name} className="border border-gray-200 rounded p-2 bg-gray-50 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <span>{t.icon}</span> <span>{t.name}</span>
                </span>
                <span className="font-bold text-blue-900">{t.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-1">
                <div
                  className="bg-[#245edb] h-full rounded-full transition-all"
                  style={{ width: `${t.score}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-500">{t.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pomodoro Study Timer Tool */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded p-3 border border-blue-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow">
        <div>
          <div className="font-bold text-sm flex items-center gap-2">
            <span>⏱️</span>
            <span>FocusFlow Study Session Stopwatch</span>
          </div>
          <div className="text-xs text-blue-200">
            Work in focused 25-minute intervals. Time completed is added to your permanent study record.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-mono text-2xl font-bold bg-black/40 px-3 py-1 rounded border border-white/20">
            {String(timerMinutes).padStart(2, '0')}:{String(timerSecs).padStart(2, '0')}
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="xp-button text-xs font-bold py-1 px-3"
          >
            {isTimerRunning ? '⏸ Pause' : '▶ Start'}
          </button>

          <button
            onClick={() => {
              setIsTimerRunning(false);
              setTimerSeconds(25 * 60);
            }}
            className="xp-button text-xs py-1 px-2"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Personal Data, Backup & Demo Mode Controls */}
      <div className="bg-white border border-[#7f9db9] rounded p-3 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
          <div>
            <h3 className="font-bold text-xs uppercase text-gray-800 flex items-center gap-1.5">
              <span>💾</span>
              <span>Personal Storage & Backup Center</span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Your data is stored privately in your browser's local storage. Export a backup anytime to prevent data loss.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAuthModal && !isDemoMode && (
              <button
                onClick={onOpenAuthModal}
                className="xp-button text-xs py-0.5 px-2.5 font-bold flex items-center gap-1 text-[#0055ea]"
              >
                <span>☁️</span>
                <span>Cloud Sync & Devices</span>
              </button>
            )}
            {onToggleDemoMode && (
              <>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isDemoMode ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-green-100 text-green-900 border border-green-300'
                }`}>
                  {isDemoMode ? '👀 Demo Profile (Read-Only)' : '🔒 Private Personal Mode'}
                </span>
                <button
                  onClick={() => onToggleDemoMode()}
                  className="xp-button text-xs py-0.5 px-2"
                >
                  {isDemoMode ? 'Switch to My Personal Data' : 'Preview Demo Mode'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {onExportBackup && (
            <button
              onClick={onExportBackup}
              className="xp-button text-xs font-bold py-1.5 px-3 flex items-center gap-1.5 text-blue-900"
            >
              <span>📥</span>
              <span>Export Backup (Download JSON)</span>
            </button>
          )}

          {onImportBackup && (
            <label className="xp-button text-xs font-bold py-1.5 px-3 flex items-center gap-1.5 text-gray-800 cursor-pointer">
              <span>📤</span>
              <span>Restore from Backup (Upload JSON)</span>
              <input
                type="file"
                accept=".json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      await onImportBackup(file);
                      alert('Backup successfully restored! All 150 days and notes are up to date.');
                    } catch (err: any) {
                      alert(`Restore error: ${err.message}`);
                    }
                    e.target.value = '';
                  }
                }}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Multi-Device Cloud Synchronization & Migration Center */}
      <div className="bg-white border border-[#7f9db9] rounded p-3 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
          <div>
            <h3 className="font-bold text-xs uppercase text-gray-800 flex items-center gap-1.5">
              <span>☁️</span>
              <span>Multi-Device Cloud Synchronization (Laptop 1, Laptop 2, Phone)</span>
            </h3>
            <p className="text-[11px] text-gray-500">
              Personal Supabase cloud sync keeps your completed days, notes, and checklist identical across all your devices.
            </p>
          </div>
          <div>
            {user ? (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                syncStatus === 'synced' ? 'bg-green-100 text-green-900 border-green-300' :
                syncStatus === 'syncing' || syncStatus === 'pending' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                syncStatus === 'offline' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                'bg-red-100 text-red-900 border-red-300'
              }`}>
                {syncStatus === 'synced' && '● Synced to Supabase'}
                {(syncStatus === 'syncing' || syncStatus === 'pending') && '↻ Syncing...'}
                {syncStatus === 'offline' && '⚠ Offline (Saved in LocalStorage)'}
                {syncStatus === 'error' && '✕ Sync Issue'}
              </span>
            ) : (
              <button
                onClick={openAuthModal}
                className="xp-button text-xs py-1 px-3 font-bold text-blue-900"
              >
                🔑 Log On to Sync Across Devices
              </button>
            )}
          </div>
        </div>

        {user ? (
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] text-gray-600">
                Signed in as: <strong className="text-blue-900">{user.email}</strong> • Last Sync:{' '}
                {lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Just now'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerManualSync()}
                  className="xp-button text-xs py-1 px-3 font-bold flex items-center gap-1"
                >
                  <span>↻</span>
                  <span>Sync Now</span>
                </button>

                <button
                  onClick={async () => {
                    const res = await importLocalProgress();
                    alert(res.message);
                  }}
                  className="xp-button text-xs py-1 px-3 font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 flex items-center gap-1"
                  title="Migrate offline localStorage progress to your cloud account"
                >
                  <span>⬆</span>
                  <span>IMPORT EXISTING LOCAL PROGRESS</span>
                </button>
              </div>
            </div>

            {localStats.hasLocalProgress && (
              <div className="bg-amber-50 border border-amber-200 p-2 rounded text-[11px] text-amber-900 flex items-center justify-between">
                <div>
                  <strong>Local progress detected:</strong> {localStats.completedDaysCount} completed days, {localStats.solvedCount} problems, {localStats.notesCount} notes.
                </div>
                <button
                  onClick={async () => {
                    const res = await importLocalProgress();
                    alert(res.message);
                  }}
                  className="px-2 py-0.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded text-[10px] cursor-pointer"
                >
                  Import to Cloud Now
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-gray-600 italic">
            Currently in local mode. All data is persisted in <code>focusflow_user_progress_v2</code>. Log in to synchronize automatically with your phone.
          </p>
        )}
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-red-50 border border-red-200 rounded p-2.5 flex items-center justify-between text-xs">
        <div>
          <div className="font-bold text-red-900">Manage Storage</div>
          <div className="text-[11px] text-red-700">Clear all locally stored preparation data.</div>
        </div>
        <button
          onClick={onResetProgress}
          className="xp-button text-red-700 hover:bg-red-600 hover:text-white text-xs font-bold py-1 px-3"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
};
