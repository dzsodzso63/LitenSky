import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('browser-geo-tz', () => ({
  find: vi.fn(),
}));

import { addCityToRecents, CACHE_DURATION, getCachedWeather, setCachedWeather } from './weather';
import { localStorageKeys } from './localStorage';
import type { RecentCity, WeatherData, WeatherValues } from '../types/weather';

const makeWeatherValues = (overrides: Partial<WeatherValues> = {}): WeatherValues => ({
  altimeterSetting: 1013,
  cloudBase: 1200,
  cloudCeiling: 1500,
  cloudCover: 0.3,
  dewPoint: 10,
  freezingRainIntensity: 0,
  humidity: 55,
  precipitationProbability: 0.1,
  pressureSeaLevel: 1013,
  pressureSurfaceLevel: 1013,
  rainIntensity: 0,
  sleetIntensity: 0,
  snowIntensity: 0,
  temperature: 20,
  temperatureApparent: 21,
  uvHealthConcern: 0,
  uvIndex: 2,
  visibility: 10,
  weatherCode: 10000,
  windDirection: 180,
  windGust: 5,
  windSpeed: 3,
  ...overrides,
});

const makeWeatherData = (overrides: Partial<WeatherData> = {}): WeatherData => ({
  data: {
    time: '2024-01-01T00:00:00Z',
    values: makeWeatherValues(),
  },
  location: {
    lat: 10,
    lon: 20,
  },
  ...overrides,
});

const createMockStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
};

describe('weather cache', () => {
  const mockStorage = createMockStorage();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    vi.stubGlobal('window', { localStorage: mockStorage } as unknown as Window);
    mockStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('returns cached weather while entry is fresh', () => {
    const sample = makeWeatherData();
    setCachedWeather(12.3456, 65.4321, sample);

    vi.setSystemTime(new Date('2024-01-01T02:00:00Z'));
    const cached = getCachedWeather(12.3456, 65.4321);

    expect(cached).toEqual(sample);
  });

  it('expires stale cache entries and cleans storage', () => {
    const sample = makeWeatherData();
    setCachedWeather(1.2345, 2.3456, sample);

    vi.setSystemTime(new Date(Date.now() + CACHE_DURATION + 1000));
    const cached = getCachedWeather(1.2345, 2.3456);

    expect(cached).toBeNull();

    const cacheContent = mockStorage.getItem(localStorageKeys.weatherCache);
    expect(cacheContent).toBe(JSON.stringify({}));
  });
});

describe('addCityToRecents', () => {
  const cityA: RecentCity = { name: 'Alpha', latitude: 10, longitude: 20 };
  const cityB: RecentCity = { name: 'Beta', latitude: 15, longitude: 25 };
  const currentLocation: RecentCity = { name: 'Current', latitude: 40, longitude: -74 };

  it('deduplicates and keeps current location at the top', () => {
    const result = addCityToRecents([cityA, cityB], { ...cityB }, currentLocation);

    expect(result[0]).toEqual(currentLocation);
    expect(result[1]).toMatchObject({ name: 'Beta' });
    expect(result[2]).toMatchObject({ name: 'Alpha' });
    expect(result).toHaveLength(3);
  });
});

