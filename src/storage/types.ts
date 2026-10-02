export interface IStorageProvider {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;
  isAvailable(): boolean;
}

export interface StorageEnvelope<T> {
  version: number;
  updatedAt: string;
  ownerUserId?: string | null;
  data: T;
}

export const CURRENT_SCHEMA_VERSION = 2;
export const PROGRESS_STORAGE_KEY = 'focusflow_user_progress_v2';
export const SETTINGS_STORAGE_KEY = 'focusflow_app_settings_v1';
export const DEMO_PROGRESS_STORAGE_KEY = 'focusflow_demo_progress_v2';

/**
 * Returns user-scoped or guest progress storage key.
 * - Guest mode (unauthenticated): 'focusflow_user_progress_v2' (preserves original local progress)
 * - Authenticated: 'focusflow_user_progress_v2_usr_<userId>' (strictly isolates User A from User B)
 * - Demo: 'focusflow_demo_progress_v2' (strictly isolated read-only demo)
 */
export function getProgressStorageKey(userId?: string | null, isDemoMode?: boolean): string {
  if (isDemoMode) return DEMO_PROGRESS_STORAGE_KEY;
  if (userId) return `${PROGRESS_STORAGE_KEY}_usr_${userId}`;
  return PROGRESS_STORAGE_KEY;
}
