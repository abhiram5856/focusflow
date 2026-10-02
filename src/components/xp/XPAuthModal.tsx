import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const XPAuthModal: React.FC = () => {
  const {
    user,
    loading,
    isConfigured,
    syncStatus,
    lastSyncedAt,
    errorMessage,
    isAuthModalOpen,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    signOut,
    triggerManualSync,
    importLocalProgress,
    localStats
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [importing, setImporting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await signInWithEmail(email, password);
        if (res.error) {
          setFeedback({ type: 'error', text: res.error });
        } else {
          setFeedback({ type: 'success', text: 'Logged on successfully!' });
        }
      } else if (mode === 'signup') {
        const res = await signUpWithEmail(email, password, fullName);
        if (res.error) {
          setFeedback({ type: 'error', text: res.error });
        } else {
          setFeedback({ type: 'success', text: res.message || 'Account created successfully!' });
        }
      } else if (mode === 'forgot') {
        const res = await resetPassword(email);
        if (res.error) {
          setFeedback({ type: 'error', text: res.error });
        } else {
          setFeedback({ type: 'success', text: res.message || 'Password reset link sent.' });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFeedback(null);
    setSubmitting(true);
    const res = await signInWithGoogle();
    if (res.error) {
      setFeedback({ type: 'error', text: res.error });
      setSubmitting(false);
    }
  };

  const handleImportLocal = async () => {
    setImporting(true);
    setFeedback(null);
    try {
      const res = await importLocalProgress();
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
      } else {
        setFeedback({ type: 'error', text: res.message });
      }
    } finally {
      setImporting(false);
    }
  };

  const handleManualSync = async () => {
    setSubmitting(true);
    try {
      const success = await triggerManualSync();
      if (success) {
        setFeedback({ type: 'success', text: 'Cloud sync completed successfully!' });
      } else {
        setFeedback({ type: 'error', text: 'Sync failed or device is offline.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="xp-window w-full max-w-[460px] shadow-2xl flex flex-col border border-[#0055ea] rounded-t-lg overflow-hidden animate-fadeIn">
        {/* Windows XP Dialog Titlebar */}
        <div className="xp-window-titlebar flex items-center justify-between px-3 py-1.5 select-none bg-gradient-to-r from-[#0058e6] via-[#3a88f7] to-[#0058e6]">
          <div className="flex items-center gap-2">
            <span className="text-base select-none">🔑</span>
            <span className="font-bold text-xs md:text-sm text-white drop-shadow">
              {user ? 'Log On to Windows — Account & Sync' : 'Windows XP Professional — Logon'}
            </span>
          </div>
          <button
            onClick={closeAuthModal}
            className="xp-titlebar-btn xp-btn-close text-xs"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-[#ece9d8] p-4 text-[#222] text-xs">
          {/* Unconfigured Alert Banner */}
          {!isConfigured && (
            <div className="mb-4 p-3 bg-[#fff8d6] border border-[#d2b444] rounded shadow-inner flex flex-col gap-1.5 text-xs text-[#554400]">
              <div className="flex items-center gap-1.5 font-bold">
                <span>⚠️</span>
                <span>Supabase Not Configured</span>
              </div>
              <p className="leading-relaxed">
                To sync your 150-Day progress across Laptop 1, Laptop 2, and Phone, connect Supabase by providing:
              </p>
              <code className="bg-black/10 px-1.5 py-0.5 rounded text-[11px] font-mono select-all">
                VITE_SUPABASE_URL<br />
                VITE_SUPABASE_ANON_KEY
              </code>
              <p className="text-[11px] text-gray-600 mt-1">
                The application is running in safe, persistent <strong>Offline LocalStorage Mode</strong>. Your progress is completely preserved locally.
              </p>
            </div>
          )}

          {feedback && (
            <div
              className={`mb-3 p-2.5 rounded border text-xs flex items-center gap-2 ${
                feedback.type === 'error'
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : feedback.type === 'success'
                  ? 'bg-green-50 border-green-300 text-green-800'
                  : 'bg-blue-50 border-blue-300 text-blue-700'
              }`}
            >
              <span>{feedback.type === 'error' ? '❌' : '✅'}</span>
              <span>{feedback.text}</span>
            </div>
          )}

          {user ? (
            /* Logged In View */
            <div className="space-y-4">
              <div className="p-3 bg-white border border-[#7f9db9] rounded shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    <div>
                      <div className="font-bold text-sm text-[#0c4da2]">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </div>
                      <div className="text-[11px] text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        syncStatus === 'synced'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : syncStatus === 'syncing' || syncStatus === 'pending'
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : syncStatus === 'offline'
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-red-100 text-red-700 border border-red-300'
                      }`}
                    >
                      {syncStatus === 'synced' && '● Synced to Cloud'}
                      {(syncStatus === 'syncing' || syncStatus === 'pending') && '↻ Syncing...'}
                      {syncStatus === 'offline' && '⚠ Offline (Saved Locally)'}
                      {syncStatus === 'error' && '⚠ Sync Error'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-600 space-y-1">
                  <div>
                    <strong>User ID:</strong> <span className="font-mono text-[10px] text-gray-500">{user.id.substring(0, 16)}...</span>
                  </div>
                  <div>
                    <strong>Last Sync:</strong>{' '}
                    {lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Just now'}
                  </div>
                  {errorMessage && (
                    <div className="text-red-600 font-medium">Notice: {errorMessage}</div>
                  )}
                </div>
              </div>

              {/* Migration Banner if local progress is detected */}
              {localStats.hasLocalProgress && (
                <div className="p-3 bg-[#ffffdf] border-2 border-[#e6b800] rounded shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8a6d00]">
                    <span className="text-base">📦</span>
                    <span>Existing Local Progress Detected (`focusflow_user_progress_v2`)</span>
                  </div>
                  <div className="text-[11px] text-gray-700 space-y-1">
                    <p>
                      We detected existing offline preparation data stored in this browser:
                    </p>
                    <div className="flex flex-wrap gap-2 py-1">
                      <span className="bg-amber-100 border border-amber-300 px-2 py-0.5 rounded font-bold text-amber-900">
                        {localStats.completedDaysCount} Completed Days
                      </span>
                      <span className="bg-blue-100 border border-blue-300 px-2 py-0.5 rounded font-bold text-blue-900">
                        {localStats.solvedCount} Problems Solved
                      </span>
                      <span className="bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-bold text-emerald-900">
                        {localStats.notesCount} Study Notes
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleImportLocal}
                    disabled={importing}
                    className="w-full xp-btn py-1.5 px-3 font-bold text-xs bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 border border-amber-600 shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>⬆</span>
                    <span>{importing ? 'Importing & Merging...' : 'IMPORT EXISTING LOCAL PROGRESS'}</span>
                  </button>
                  <p className="text-[10px] text-gray-500 italic">
                    Safely merges your local progress with your cloud account so Laptop 1, Laptop 2, and Phone have identical progress.
                  </p>
                </div>
              )}

              {/* Sync Actions */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-gray-700">Cloud Synchronization:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleManualSync}
                    disabled={submitting}
                    className="xp-btn py-1.5 px-3 font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>↻</span>
                    <span>{submitting ? 'Syncing...' : 'Sync Now'}</span>
                  </button>

                  <button
                    onClick={handleImportLocal}
                    disabled={importing}
                    title="Upload existing browser localStorage progress to this Supabase account"
                    className="xp-btn py-1.5 px-3 font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>⬆</span>
                    <span>{importing ? 'Importing...' : 'Import Local Data'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 italic">
                  Changes made on this device automatically merge with Laptop 1, Laptop 2, and Phone.
                </p>
              </div>

              {/* Log Off Button */}
              <div className="pt-2 border-t border-[#d4d0c8] flex justify-between items-center">
                <button
                  onClick={closeAuthModal}
                  className="xp-btn py-1 px-4 text-xs font-semibold"
                >
                  OK
                </button>
                <button
                  onClick={signOut}
                  className="xp-btn py-1 px-4 text-xs text-red-700 font-bold hover:bg-red-50"
                >
                  Log Off
                </button>
              </div>
            </div>
          ) : (
            /* Logged Out / Auth Form */
            <div>
              {/* Tab Selector */}
              <div className="flex border-b border-[#7f9db9] mb-3 text-xs">
                <button
                  onClick={() => { setMode('login'); setFeedback(null); }}
                  className={`px-3 py-1 font-bold ${
                    mode === 'login'
                      ? 'bg-white border-t-2 border-t-[#0055ea] border-l border-r border-[#7f9db9] -mb-px'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Log On
                </button>
                <button
                  onClick={() => { setMode('signup'); setFeedback(null); }}
                  className={`px-3 py-1 font-bold ${
                    mode === 'signup'
                      ? 'bg-white border-t-2 border-t-[#0055ea] border-l border-r border-[#7f9db9] -mb-px'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Create Account
                </button>
                {mode === 'forgot' && (
                  <button
                    className="px-3 py-1 font-bold bg-white border-t-2 border-t-[#0055ea] border-l border-r border-[#7f9db9] -mb-px"
                  >
                    Reset Password
                  </button>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Full Name / User Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Abhiram"
                      className="w-full px-2.5 py-1 text-xs border border-[#7f9db9] bg-white rounded-xs focus:outline-[#0055ea]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                    User name / Email address:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-2.5 py-1 text-xs border border-[#7f9db9] bg-white rounded-xs focus:outline-[#0055ea]"
                  />
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Password:
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-2.5 py-1 text-xs border border-[#7f9db9] bg-white rounded-xs focus:outline-[#0055ea]"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  {mode === 'login' ? (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setFeedback(null); }}
                      className="text-[11px] text-blue-700 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  ) : mode === 'forgot' ? (
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setFeedback(null); }}
                      className="text-[11px] text-blue-700 hover:underline cursor-pointer"
                    >
                      Back to Log On
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={closeAuthModal}
                      className="xp-btn py-1 px-3 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !isConfigured}
                      className="xp-btn py-1 px-4 text-xs font-bold text-[#003c74]"
                    >
                      {submitting ? 'Please wait...' : mode === 'login' ? 'Log On' : mode === 'signup' ? 'Create' : 'Send Link'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Google OAuth alternative */}
              {isConfigured && mode === 'login' && (
                <div className="mt-4 pt-3 border-t border-[#d4d0c8] space-y-2">
                  <div className="text-[11px] text-center text-gray-500 font-semibold">
                    — Or log on with —
                  </div>
                  <button
                    onClick={handleGoogleLogin}
                    disabled={submitting}
                    className="w-full xp-btn py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span>🌐</span>
                    <span>Sign in with Google</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-[#ece9d8] border-t border-[#d4d0c8] px-3 py-1 text-[11px] text-gray-600 flex justify-between select-none">
          <span>FocusFlow 150-Day Security Subsystem</span>
          <span>{loading ? 'Authenticating...' : isConfigured ? 'Supabase Connected' : 'Offline Mode'}</span>
        </div>
      </div>
    </div>
  );
};
