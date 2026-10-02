import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { syncManager, type SyncStatus } from '../storage/syncManager';
import type { UserProgress } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt?: Date;
  errorMessage?: string;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error?: string; message?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  triggerManualSync: () => Promise<boolean>;
  importLocalProgress: () => Promise<{ success: boolean; message: string }>;
  onLoginProgressSync?: (callback: (merged: UserProgress) => void) => () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ 
  children: React.ReactNode; 
  onProgressLoaded?: (progress: UserProgress) => void;
}> = ({ children, onProgressLoaded }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('unconfigured');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const isConfigured = isSupabaseConfigured();

  // Subscribe to syncManager status changes
  useEffect(() => {
    const unsubscribe = syncManager.subscribe((status, syncedAt, err) => {
      setSyncStatus(status);
      setLastSyncedAt(syncedAt);
      setErrorMessage(err);
    });
    return unsubscribe;
  }, []);

  // Listen to Supabase auth events
  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Check active session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        syncManager.setUserId(session.user.id);
        // Automatic pull and non-destructive merge on initial app load
        syncManager.pullAndMergeOnLogin(session.user.id).then(merged => {
          if (onProgressLoaded) {
            onProgressLoaded(merged);
          }
        });
      } else {
        syncManager.setUserId(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        syncManager.setUserId(session.user.id);
        const merged = await syncManager.pullAndMergeOnLogin(session.user.id);
        if (onProgressLoaded) {
          onProgressLoaded(merged);
        }
      } else if (event === 'SIGNED_OUT') {
        syncManager.setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured, onProgressLoaded]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!isConfigured) {
      return { error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.' };
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      closeAuthModal();
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Login failed' };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    if (!isConfigured) {
      return { error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.' };
    }
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0]
          }
        }
      });
      if (error) return { error: error.message };
      if (data.session) {
        closeAuthModal();
        return { message: 'Account created and logged in successfully!' };
      }
      return { message: 'Confirmation email sent. Please check your inbox to verify your account.' };
    } catch (err: any) {
      return { error: err?.message || 'Registration failed' };
    }
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      return { error: 'Supabase is not configured.' };
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Google sign in failed' };
    }
  };

  const resetPassword = async (email: string) => {
    if (!isConfigured) {
      return { error: 'Supabase is not configured.' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#reset-password`
      });
      if (error) return { error: error.message };
      return { message: 'Password reset link sent to your email.' };
    } catch (err: any) {
      return { error: err?.message || 'Password reset request failed' };
    }
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    syncManager.setUserId(null);
  };

  const triggerManualSync = async () => {
    return await syncManager.syncNow();
  };

  const importLocalProgress = async () => {
    if (!user) {
      return { success: false, message: 'You must be logged in to import progress to cloud.' };
    }
    return await syncManager.importLocalProgressToCloud(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured,
        syncStatus,
        lastSyncedAt,
        errorMessage,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        signOut,
        triggerManualSync,
        importLocalProgress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
