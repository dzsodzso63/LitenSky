import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TOMORROW_API_BASE_URL, TOMORROW_API_KEY, TOMORROW_API_OPTIONS } from '../constants/weather';
import { getCachedWeather, setCachedWeather, CACHE_DURATION } from '../utils/weather';
import type { City, WeatherData } from '../types/weather';

export const useWeatherData = (city: City | null) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Load cached weather data
  useEffect(() => {
    if (city) {
      const cachedData = getCachedWeather(city.latitude, city.longitude);
      if (cachedData) {
        setWeatherData(cachedData);
      }
    }
  }, []);

  // fetch weather data
  const { data: fetchedWeatherData, isLoading } = useQuery({
    queryKey: ['weather', city?.latitude, city?.longitude],
    queryFn: async (): Promise<WeatherData> => {
      if (!city) {
        throw new Error('City is required');
      }

      // Check cache first
      const cachedData = getCachedWeather(city.latitude, city.longitude);
      if (cachedData) {
        return cachedData;
      }

      const location = `${city.latitude}%2C%20${city.longitude}`;
      const url = `${TOMORROW_API_BASE_URL}?units=metric&location=${location}&apikey=${TOMORROW_API_KEY}`;

      const response = await fetch(url, TOMORROW_API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data: WeatherData = await response.json();

      setCachedWeather(city.latitude, city.longitude, data);

      return data;
    },
    enabled: city !== null,
    staleTime: CACHE_DURATION,
  });

  useEffect(() => {
    if (fetchedWeatherData) {
      setWeatherData(fetchedWeatherData);
    }
  }, [fetchedWeatherData]);

  return { weatherData, isLoading };
};
