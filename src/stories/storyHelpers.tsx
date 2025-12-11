import { useEffect, useMemo } from 'react';
import { QueryClient } from '@tanstack/react-query';
import {
  WeatherContext,
  type WeatherContextType,
  type City,
  type WeatherData,
  type CityWeather,
} from '../contexts/WeatherContext';
import { SettingsProvider, useSettings } from '../contexts/SettingsContext';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

export const createMockCity = (overrides: Partial<City> = {}): City => ({
  name: 'New York',
  latitude: 40.7128,
  longitude: -74.006,
  timezone: 'America/New_York',
  ...overrides,
});

export const createMockWeatherData = ({
  weatherCode = 1000,
  temperature = 22,
  temperatureApparent = temperature + 1,
  cloudCover = 50,
  rainIntensity = 0,
  snowIntensity = 0,
  windSpeed = 5,
  windDirection = 180,
  precipitationProbability = 20,
  humidity = 60,
  pressureSeaLevel = 1013.25,
  latitude = 40.7128,
  longitude = -74.006,
  time = new Date().toISOString(),
}: Partial<WeatherData['data']['values']> & {
  weatherCode?: number;
  temperature?: number;
  temperatureApparent?: number;
  rainIntensity?: number;
  snowIntensity?: number;
  windSpeed?: number;
  windDirection?: number;
  precipitationProbability?: number;
  humidity?: number;
  pressureSeaLevel?: number;
  latitude?: number;
  longitude?: number;
  time?: string;
} = {}): WeatherData => ({
  data: {
    time,
    values: {
      altimeterSetting: pressureSeaLevel,
      cloudBase: 1000,
      cloudCeiling: 2000,
      cloudCover,
      dewPoint: temperature - 3,
      freezingRainIntensity: 0,
      humidity,
      precipitationProbability,
      pressureSeaLevel,
      pressureSurfaceLevel: pressureSeaLevel,
      rainIntensity,
      sleetIntensity: 0,
      snowIntensity,
      temperature,
      temperatureApparent,
      uvHealthConcern: 1,
      uvIndex: 3,
      visibility: 10000,
      weatherCode,
      windDirection,
      windGust: windSpeed + 2,
      windSpeed,
    },
  },
  location: {
    lat: latitude,
    lon: longitude,
  },
});

export const createMockCityWeather = (
  overrides: Partial<CityWeather> & {
    weatherOverrides?: Parameters<typeof createMockWeatherData>[0];
  } = {}
): CityWeather => {
  const city = overrides.city ?? createMockCity();
  const weatherData =
    overrides.weatherData ?? createMockWeatherData({ latitude: city.latitude, longitude: city.longitude, ...overrides.weatherOverrides });

  return {
    city,
    cityImage: overrides.cityImage ?? null,
    weatherData,
    timeOfDay: overrides.timeOfDay ?? 'day',
    isLoading: overrides.isLoading ?? false,
    isCurrent: overrides.isCurrent ?? false,
  };
};

type MockWeatherProviderProps = Partial<WeatherContextType> & {
  children: React.ReactNode;
};

export const MockWeatherProvider = ({ children, ...overrides }: MockWeatherProviderProps) => {
  const value = useMemo<WeatherContextType>(
    () => ({
      weatherData: overrides.weatherData ?? createMockWeatherData(),
      timeOfDay: overrides.timeOfDay ?? 'day',
      city: overrides.city ?? createMockCity(),
      cityImage: overrides.cityImage ?? null,
      recentCities: overrides.recentCities ?? [],
      setCity: overrides.setCity ?? (() => { }),
      removeCityFromRecents: overrides.removeCityFromRecents ?? (() => { }),
      isLoading: overrides.isLoading ?? false,
      isCityImageLoading: overrides.isCityImageLoading ?? false,
    }),
    [
      overrides.weatherData,
      overrides.timeOfDay,
      overrides.city,
      overrides.cityImage,
      overrides.recentCities,
      overrides.setCity,
      overrides.removeCityFromRecents,
      overrides.isLoading,
      overrides.isCityImageLoading,
    ]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

const UnitInitializer = ({ unit }: { unit: 'metric' | 'imperial' }) => {
  const { setUnit } = useSettings();

  useEffect(() => {
    setUnit(unit);
  }, [setUnit, unit]);

  return null;
};

export const SettingsUnitProvider = ({
  unit = 'metric',
  children,
}: {
  unit?: 'metric' | 'imperial';
  children: React.ReactNode;
}) => (
  <SettingsProvider>
    <UnitInitializer unit={unit} />
    {children}
  </SettingsProvider>
);
