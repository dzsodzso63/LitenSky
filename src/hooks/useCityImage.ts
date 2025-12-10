import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getLocalStorageItem, localStorageKeys, setLocalStorageItem } from '../utils/localStorage';
import { isSameCity } from '../utils/weather';
import type { City, RecentCity } from '../types/weather';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?auto=format&fit=crop&w=1920&q=80';
import { UNSPLASH_ACCESS_KEY } from '../constants/apiKeys';

const fetchCityImage = async (cityName: string, signal: AbortSignal): Promise<string> => {
  const query = `${cityName} city cityscape`;
  const response = await fetch(
    `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1&orientation=landscape&order_by=relevant`,
    { signal }
  );
  if (!response.ok) {
    throw new Error(`Unsplash API Error: ${response.statusText}`);
  }
  const data = await response.json();
  const bestImage = data?.results?.[0]?.urls?.regular;
  return bestImage || FALLBACK_IMAGE;
};

const getCachedImageFromRecents = (city: City | null): string | null => {
  if (!city) return null;
  const recentCities = getLocalStorageItem<RecentCity[]>(localStorageKeys.recentCities, []);
  const match = recentCities.find((recentCity) => isSameCity(recentCity, city));
  return match?.cityImage ?? null;
};

const persistImageToRecents = (city: City | null, imageUrl: string) => {
  if (!city) return;
  const recentCities = getLocalStorageItem<RecentCity[]>(localStorageKeys.recentCities, []);
  let updated = false;

  const updatedRecents = recentCities.map((recentCity) => {
    if (isSameCity(recentCity, city)) {
      updated = true;
      return { ...recentCity, cityImage: imageUrl };
    }
    return recentCity;
  });

  if (updated) {
    setLocalStorageItem(localStorageKeys.recentCities, updatedRecents);
  }
};

export const useCityImage = (city: City | null): UseQueryResult<string, Error> => {
  return useQuery({
    queryKey: ['city-image', city?.latitude, city?.longitude, city?.name],
    queryFn: async ({ signal }) => {
      // Check cached image on recent cities (no expiry)
      const cachedRecentImage = getCachedImageFromRecents(city);
      if (cachedRecentImage) return cachedRecentImage;

      // Fetch from API if not in cache or expired
      const imageUrl = await fetchCityImage(city?.name ?? '', signal);

      // Persist to recent cities cache if present
      persistImageToRecents(city, imageUrl);

      return imageUrl;
    },
    enabled: !!city?.name,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};