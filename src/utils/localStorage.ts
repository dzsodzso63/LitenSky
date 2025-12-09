/**
 * Utility functions for localStorage operations
 */

export const localStorageKeys = {
  settings: 'litensky_settings',
  city: 'litensky_city',
  recentCities: 'litensky_recent_cities',
  weatherCache: 'litensky_weather_cache',
  cityImage: 'litensky_city_image',
} as const;

/**
 * Get item from localStorage with error handling
 */
export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to read from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage with error handling
 */
export const setLocalStorageItem = <T>(key: string, value: T): void => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write to localStorage key "${key}":`, error);
  }
};

/**
 * Remove item from localStorage
 */
export const removeLocalStorageItem = (key: string): void => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove localStorage key "${key}":`, error);
  }
};

/**
 * Type for cached items with expiration
 */
type CachedItem<T> = {
  value: T;
  expiresAt: number;
};

/**
 * Get item from localStorage with expiration check
 * Returns null if expired or not found
 */
export const getLocalStorageItemWithExpiry = <T>(key: string): T | null => {
  try {
    if (typeof window === 'undefined') return null;
    const item = window.localStorage.getItem(key);
    if (item === null) return null;

    const cached: CachedItem<T> = JSON.parse(item);
    const now = Date.now();

    // Check if expired
    if (now > cached.expiresAt) {
      window.localStorage.removeItem(key);
      return null;
    }

    return cached.value;
  } catch (error) {
    console.warn(`Failed to read from localStorage key "${key}":`, error);
    return null;
  }
};

/**
 * Set item in localStorage with expiration (in milliseconds)
 */
export const setLocalStorageItemWithExpiry = <T>(key: string, value: T, expiryMs: number): void => {
  try {
    if (typeof window === 'undefined') return;
    const cached: CachedItem<T> = {
      value,
      expiresAt: Date.now() + expiryMs,
    };
    window.localStorage.setItem(key, JSON.stringify(cached));
  } catch (error) {
    console.warn(`Failed to write to localStorage key "${key}":`, error);
  }
};
