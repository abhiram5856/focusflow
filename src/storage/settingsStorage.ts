import type { AppSettings } from '../types';
import { defaultStorageProvider } from './LocalStorageProvider';
import { SETTINGS_STORAGE_KEY } from './types';

export const defaultSettings: AppSettings = {
  isDemoMode: false,
  theme: 'luna-blue',
  soundEnabled: true,
  autoSaveIntervalMs: 5000
};

export function loadSettings(): AppSettings {
  // Check if URL query string specifies ?demo=true for instant sharing
  const isUrlDemo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === 'true';

  const stored = defaultStorageProvider.getItem<AppSettings>(SETTINGS_STORAGE_KEY);
  if (!stored) {
    return { ...defaultSettings, isDemoMode: isUrlDemo };
  }

  return {
    ...defaultSettings,
    ...stored,
    isDemoMode: isUrlDemo || stored.isDemoMode
  };
}

export function saveSettings(settings: AppSettings): void {
  defaultStorageProvider.setItem(SETTINGS_STORAGE_KEY, settings);
}
