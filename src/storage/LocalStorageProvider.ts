import type { IStorageProvider } from './types';

/**
 * LocalStorageProvider
 * 
 * Provides safe, versioned access to the browser's localStorage.
 * Includes in-memory fallback for private windows or when cookies/localStorage are restricted.
 * Abstracted via IStorageProvider so that a future CloudStorageProvider (e.g. Supabase, Firebase)
 * can be plugged in without refactoring client components.
 */
export class LocalStorageProvider implements IStorageProvider {
  private memoryFallback: Map<string, string> = new Map();

  isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    try {
      if (this.isAvailable()) {
        const item = window.localStorage.getItem(key);
        if (item === null) return null;
        return JSON.parse(item) as T;
      } else {
        const memItem = this.memoryFallback.get(key);
        if (!memItem) return null;
        return JSON.parse(memItem) as T;
      }
    } catch (err) {
      console.warn(`[LocalStorageProvider] Failed to read key "${key}":`, err);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      if (this.isAvailable()) {
        window.localStorage.setItem(key, serialized);
      } else {
        this.memoryFallback.set(key, serialized);
      }
    } catch (err) {
      console.error(`[LocalStorageProvider] Quota exceeded or write failed for "${key}":`, err);
      // Fallback to memory so user session doesn't crash
      try {
        this.memoryFallback.set(key, JSON.stringify(value));
      } catch {
        // Ignore fallback write errors
      }
    }
  }

  removeItem(key: string): void {
    try {
      if (this.isAvailable()) {
        window.localStorage.removeItem(key);
      }
      this.memoryFallback.delete(key);
    } catch (err) {
      console.warn(`[LocalStorageProvider] Failed to remove "${key}":`, err);
    }
  }

  clear(): void {
    try {
      if (this.isAvailable()) {
        window.localStorage.clear();
      }
      this.memoryFallback.clear();
    } catch (err) {
      console.warn('[LocalStorageProvider] Clear failed:', err);
    }
  }
}

export const defaultStorageProvider = new LocalStorageProvider();
