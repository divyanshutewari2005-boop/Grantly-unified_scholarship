/**
 * Storage service wrapping localStorage with defensive try/catch.
 * Ensures SSR-safety and privacy sandbox protection.
 */

const STORAGE_PREFIX = "grantly_";

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return defaultValue;
      }
      const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[storage.get] Error reading key "${key}":`, e);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return false;
      }
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[storage.set] Error saving key "${key}":`, e);
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return false;
      }
      window.localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (e) {
      console.warn(`[storage.remove] Error removing key "${key}":`, e);
      return false;
    }
  },

  clear(): boolean {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return false;
      }
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      return true;
    } catch (e) {
      console.warn("[storage.clear] Error clearing storage:", e);
      return false;
    }
  }
};
