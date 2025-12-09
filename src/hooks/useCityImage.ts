import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getLocalStorageItemWithExpiry, setLocalStorageItemWithExpiry, localStorageKeys } from '../utils/localStorage';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80';
const UNSPLASH_KEY = 'oejAbXL4CoXmO12scPXyBUgT98pcL_r7IpA1U1lX4S4';
const CACHE_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

const fetchCityImage = async (cityName: string, signal: AbortSignal): Promise<string> => {
  // 1. We enforce "skyline" and "architecture" to filter out people/food
  // 2. We use /search/photos instead of /random to get the "best" result
  // 3. per_page=1 ensures we only grab the top result
  const query = `${cityName} city cityscape`;

  const response = await fetch(
    `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${UNSPLASH_KEY}&per_page=1&orientation=landscape&order_by=relevant`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(`Unsplash API Error: ${response.statusText}`);
  }

  const data = await response.json();

  const bestImage = data?.results?.[0]?.urls?.regular;

  return bestImage || FALLBACK_IMAGE;
};

export const useCityImage = (cityName: string): UseQueryResult<string, Error> => {
  return useQuery({
    queryKey: ['city-image', cityName],
    queryFn: async ({ signal }) => {
      // Check localStorage first
      const cacheKey = `${localStorageKeys.cityImage}_${cityName}`;
      const cachedImage = getLocalStorageItemWithExpiry<string>(cacheKey);

      if (cachedImage) {
        return cachedImage;
      }

      // Fetch from API if not in cache or expired
      const imageUrl = await fetchCityImage(cityName, signal);

      // Save to localStorage with expiration
      setLocalStorageItemWithExpiry(cacheKey, imageUrl, CACHE_DURATION_MS);

      return imageUrl;
    },
    enabled: !!cityName,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};