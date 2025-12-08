/**
 * Utility functions for localStorage operations
 */

export const localStorageKeys = {
  settings: 'litensky_settings',
  city: 'litensky_city',
  recentCities: 'litensky_recent_cities',
  weatherCache: 'litensky_weather_cache',
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
