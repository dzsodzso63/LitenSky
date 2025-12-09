import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useCityImage } from '../hooks/useCityImage';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useWeatherData } from '../hooks/useWeatherData';
import { useRecentCitiesWeather } from '../hooks/useRecentCitiesWeather';
import { useTimeOfDay } from '../hooks/useTimeOfDay';
import { getLocalStorageItem, setLocalStorageItem, localStorageKeys } from '../utils/localStorage';
import { isSameCity, addCityToRecents, MAX_RECENT_CITIES } from '../utils/weather';
import type { City, WeatherData, TimeOfDay, CityWeather } from '../types/weather';

export type { City, WeatherData, TimeOfDay, CityWeather } from '../types/weather';

export type WeatherContextType = {
  weatherData: WeatherData | null;
  timeOfDay: TimeOfDay;
  city: City | null;
  cityImage: string | null;
  recentCities: CityWeather[];
  setCity: (city: City) => void;
  clearRecentCities: () => void;
  removeCityFromRecents: (city: City) => void;
  isLoading: boolean;
  isCityImageLoading: boolean;
};

export const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  // Load city and recent cities from localStorage on mount
  const storedCity = getLocalStorageItem<City | null>(localStorageKeys.city, null);
  const storedRecentCities = getLocalStorageItem<City[]>(localStorageKeys.recentCities, []);

  // Initialize recent cities
  const initialRecentCities = (() => {
    if (storedRecentCities.length === 0 && storedCity) {
      return [storedCity];
    }
    if (storedCity) {
      // Remove stored city from recents if it's there
      return storedRecentCities.filter((c) => !isSameCity(c, storedCity));
    }
    return storedRecentCities;
  })();

  const [city, setCityState] = useState<City | null>(storedCity);
  const [recentCities, setRecentCitiesState] = useState<City[]>(initialRecentCities);

  // Custom hooks
  const currentLocationCity = useCurrentLocation();
  const { weatherData, isLoading } = useWeatherData(city);
  const timeOfDay = useTimeOfDay(city);
  const { data: cityImage, isLoading: isCityImageLoading } = useCityImage(city?.name ?? '');
  const recentCitiesWithWeather = useRecentCitiesWeather(recentCities, city, currentLocationCity);

  // Set current location as selected city if no city is currently selected
  useEffect(() => {
    if (currentLocationCity && !city) {
      setCityState(currentLocationCity);
    }
  }, [currentLocationCity, city]);

  // Persist city to localStorage whenever it changes
  useEffect(() => {
    if (city) {
      setLocalStorageItem(localStorageKeys.city, city);
    } else {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(localStorageKeys.city);
        }
      } catch {
        // Ignore errors
      }
    }
  }, [city]);

  // Persist recent cities to localStorage whenever they change
  useEffect(() => {
    setLocalStorageItem(localStorageKeys.recentCities, recentCities);
  }, [recentCities]);

  // Ensure current location city is always in recents (first position)
  useEffect(() => {
    if (currentLocationCity) {
      setRecentCitiesState((prev) => {
        // If already at first position, no change needed
        if (prev.length > 0 && isSameCity(prev[0], currentLocationCity)) {
          return prev;
        }
        // Add at start, removing any duplicates
        return addCityToRecents(prev, currentLocationCity);
      });
    }
  }, [currentLocationCity]);

  const setCity = (cityData: City) => {
    if (!cityData.name.trim()) return;

    const previousCity = city;

    // Remove the new city from recents (selected city shouldn't be in recents)
    setRecentCitiesState((prev) => {
      let updated = prev.filter((c) => !isSameCity(c, cityData));

      // If there was a previous city and it's different from the new one, add it to recents
      if (previousCity && !isSameCity(previousCity, cityData)) {
        // Add previous city after current location (removing duplicates)
        updated = addCityToRecents(updated, previousCity, currentLocationCity);
      }

      // Keep only the most recent 20 cities
      return updated.slice(0, MAX_RECENT_CITIES);
    });

    setCityState(cityData);
  };

  const clearRecentCities = () => {
    // Keep only the current location city
    if (currentLocationCity) {
      setRecentCitiesState([currentLocationCity]);
      // Set it as the selected city
      setCityState(currentLocationCity);
    } else {
      setRecentCitiesState([]);
    }
  };

  const removeCityFromRecents = (cityToRemove: City) => {
    // Don't allow removing the current location city
    if (currentLocationCity && isSameCity(cityToRemove, currentLocationCity)) {
      return;
    }

    setRecentCitiesState((prev) => prev.filter((c) => !isSameCity(c, cityToRemove)));
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        timeOfDay,
        city,
        cityImage: cityImage ?? null,
        recentCities: recentCitiesWithWeather,
        setCity,
        clearRecentCities,
        removeCityFromRecents,
        isLoading,
        isCityImageLoading,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
