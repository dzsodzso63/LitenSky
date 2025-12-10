import { getTimes } from 'suncalc';
import { MAPBOX_ACCESS_TOKEN, MAPBOX_REVERSE_GEOCODE_BASE_URL } from '../constants/mapbox';
import { getLocalStorageItem, setLocalStorageItem, localStorageKeys } from './localStorage';
import type { City, RecentCity, WeatherData, TimeOfDay } from '../types/weather';

// Weather cache structure
type WeatherCacheEntry = {
  data: WeatherData;
  timestamp: number;
};

type WeatherCache = {
  [key: string]: WeatherCacheEntry;
};

export const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
export const MAX_RECENT_CITIES = 20;

// Generate cache key from location
const getCacheKey = (latitude: number, longitude: number): string => {
  // Round to 4 decimal places (~11 meters precision) for cache key
  return `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
};

// Get cached weather data if valid
export const getCachedWeather = (latitude: number, longitude: number): WeatherData | null => {
  try {
    const cache = getLocalStorageItem<WeatherCache>(localStorageKeys.weatherCache, {});
    const key = getCacheKey(latitude, longitude);
    const entry = cache[key];

    if (!entry) return null;

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if cache is still valid
    if (age < CACHE_DURATION) {
      return entry.data;
    }

    // Cache expired, remove it
    delete cache[key];
    setLocalStorageItem(localStorageKeys.weatherCache, cache);
    return null;
  } catch {
    return null;
  }
};

// Save weather data to cache
export const setCachedWeather = (latitude: number, longitude: number, data: WeatherData): void => {
  try {
    const cache = getLocalStorageItem<WeatherCache>(localStorageKeys.weatherCache, {});
    const key = getCacheKey(latitude, longitude);
    cache[key] = {
      data,
      timestamp: Date.now(),
    };
    setLocalStorageItem(localStorageKeys.weatherCache, cache);
  } catch (error) {
    console.warn('Failed to cache weather data:', error);
  }
};

// Reverse geocode coordinates to get city name using Mapbox
export const reverseGeocode = async (latitude: number, longitude: number): Promise<string | null> => {
  try {
    const url = `${MAPBOX_REVERSE_GEOCODE_BASE_URL}?access_token=${MAPBOX_ACCESS_TOKEN}&longitude=${longitude}&latitude=${latitude}&types=place&limit=1`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const cityName = data.features[0].properties?.name;
      return cityName || null;
    }
    return null;
  } catch {
    return null;
  }
};

// Calculate timeOfDay based on suncalc times
export const calculateTimeOfDay = (latitude: number, longitude: number): TimeOfDay => {
  const now = new Date();
  const times = getTimes(now, latitude, longitude);

  const currentTime = now.getTime();
  const dawn = times.dawn.getTime();
  const sunrise = times.goldenHourEnd.getTime();
  const sunset = times.goldenHour.getTime();
  const dusk = times.dusk.getTime();

  if (currentTime >= dawn && currentTime < sunrise) {
    return 'sunrise';
  } else if (currentTime >= sunrise && currentTime < sunset) {
    return 'day';
  } else if (currentTime >= sunset && currentTime < dusk) {
    return 'sunset';
  } else {
    return 'night';
  }
};

// Helper to check if two cities are the same (by coordinates)
export const isSameCity = (city1: City, city2: City): boolean => {
  return (
    Math.abs(city1.latitude - city2.latitude) < 0.0001 &&
    Math.abs(city1.longitude - city2.longitude) < 0.0001
  ) || (
      city1.name?.toLowerCase() === city2.name?.toLowerCase() &&
      Math.abs(city1.latitude - city2.latitude) < 0.5 &&
      Math.abs(city1.longitude - city2.longitude) < 0.5
    );
};

// Helper to add a city to recents, removing any duplicates first
export const addCityToRecents = (
  cities: RecentCity[],
  cityToAdd: RecentCity,
  currentLocationCity: RecentCity | null = null
): RecentCity[] => {
  const withoutCity = cities.filter(
    (c) => !isSameCity(c, cityToAdd) && (!currentLocationCity || !isSameCity(c, currentLocationCity))
  );

  if (currentLocationCity && !isSameCity(cityToAdd, currentLocationCity)) {
    return [currentLocationCity, cityToAdd, ...withoutCity];
  } else {
    return [cityToAdd, ...withoutCity];
  }
};
