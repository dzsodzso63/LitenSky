import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { TOMORROW_API_BASE_URL, TOMORROW_API_KEY, TOMORROW_API_OPTIONS } from '../constants/weather';
import { getCachedWeather, setCachedWeather, CACHE_DURATION, isSameCity, calculateTimeOfDay } from '../utils/weather';
import type { City, CityWeather, WeatherData } from '../types/weather';

export const useRecentCitiesWeather = (
  recentCities: City[],
  selectedCity: City | null,
  currentLocationCity: City | null
): CityWeather[] => {
  // Fetch weather for all recent cities (excluding the currently selected city)
  const recentCitiesQueries = useQueries({
    queries: recentCities
      .filter((recentCity) => !selectedCity || !isSameCity(recentCity, selectedCity))
      .map((recentCity) => ({
        queryKey: ['weather', recentCity.latitude, recentCity.longitude],
        queryFn: async (): Promise<WeatherData> => {
          // Check cache first
          const cachedData = getCachedWeather(recentCity.latitude, recentCity.longitude);
          if (cachedData) {
            return cachedData;
          }

          // Fetch from API if not in cache or cache expired
          const location = `${recentCity.latitude}%2C%20${recentCity.longitude}`;
          const url = `${TOMORROW_API_BASE_URL}?location=${location}&apikey=${TOMORROW_API_KEY}`;
          
          const response = await fetch(url, TOMORROW_API_OPTIONS);
          if (!response.ok) {
            throw new Error('Failed to fetch weather data');
          }
          
          const data: WeatherData = await response.json();
          
          // Cache the fetched data
          setCachedWeather(recentCity.latitude, recentCity.longitude, data);
          
          return data;
        },
        staleTime: CACHE_DURATION,
      })),
  });

  // Combine recent cities with their weather data
  // Exclude the currently selected city from the list
  const recentCitiesWithWeather = useMemo((): CityWeather[] => {
    const filteredRecents = recentCities.filter(
      (recentCity) => !selectedCity || !isSameCity(recentCity, selectedCity)
    );
    return filteredRecents.map((recentCity, index) => {
      const queryResult = recentCitiesQueries[index];
      const isCurrent = currentLocationCity ? isSameCity(recentCity, currentLocationCity) : false;
      return {
        city: recentCity,
        weatherData: queryResult?.data ?? null,
        timeOfDay: calculateTimeOfDay(recentCity.latitude, recentCity.longitude),
        isLoading: queryResult?.isLoading ?? false,
        isCurrent,
      };
    });
  }, [recentCities, recentCitiesQueries, currentLocationCity, selectedCity]);

  return recentCitiesWithWeather;
};
