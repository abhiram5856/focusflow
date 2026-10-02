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
  data: T;
}

export const CURRENT_SCHEMA_VERSION = 2;
export const PROGRESS_STORAGE_KEY = 'focusflow_user_progress_v2';
export const SETTINGS_STORAGE_KEY = 'focusflow_app_settings_v1';
export const DEMO_PROGRESS_STORAGE_KEY = 'focusflow_demo_progress_v2';
