import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TOMORROW_API_BASE_URL, TOMORROW_API_KEY, TOMORROW_API_OPTIONS } from '../constants/weather';
import { getCachedWeather, setCachedWeather, CACHE_DURATION } from '../utils/weather';
import type { City, WeatherData } from '../types/weather';

export const useWeatherData = (city: City | null) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Load cached weather data on mount if we have a city
  useEffect(() => {
    if (city) {
      const cachedData = getCachedWeather(city.latitude, city.longitude);
      if (cachedData) {
        setWeatherData(cachedData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // React Query to fetch weather data when city changes
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

      // Fetch from API if not in cache or cache expired
      const location = `${city.latitude}%2C%20${city.longitude}`;
      const url = `${TOMORROW_API_BASE_URL}?units=metric&location=${location}&apikey=${TOMORROW_API_KEY}`;
      
      const response = await fetch(url, TOMORROW_API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data: WeatherData = await response.json();
      
      // Cache the fetched data
      setCachedWeather(city.latitude, city.longitude, data);
      
      return data;
    },
    enabled: city !== null,
    staleTime: CACHE_DURATION,
  });

  // Update weatherData when fetched data changes
  useEffect(() => {
    if (fetchedWeatherData) {
      setWeatherData(fetchedWeatherData);
    }
  }, [fetchedWeatherData]);

  return { weatherData, isLoading };
};
