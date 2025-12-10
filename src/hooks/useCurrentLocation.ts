import { useState, useEffect } from 'react';
import { reverseGeocode, getTimezone } from '../utils/weather';
import type { City } from '../types/weather';

export const useCurrentLocation = () => {
  const [currentLocationCity, setCurrentLocationCity] = useState<City | null>(null);

  useEffect(() => {
    // Only resolve once if we don't already have a current location city
    if (currentLocationCity) return;

    let isCancelled = false;

    const setResolvedCity = async (latitude: number, longitude: number, cityName?: string) => {
      if (isCancelled) return;

      // If no city name provided, try reverse geocoding with Mapbox
      let resolvedCityName = cityName?.trim();
      if (!resolvedCityName) {
        const reverseGeocodedName = await reverseGeocode(latitude, longitude);
        resolvedCityName = reverseGeocodedName || 'Current City';
      }

      if (isCancelled) return;
      const timezone = await getTimezone(latitude, longitude);
      if (isCancelled) return;
      const resolvedCity: City = {
        name: resolvedCityName,
        latitude,
        longitude,
        timezone,
      };
      setCurrentLocationCity(resolvedCity);
    };

    const resolveFromGeolocation = async () => {
      if (!('geolocation' in navigator)) return false;

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
        );
        await setResolvedCity(position.coords.latitude, position.coords.longitude);
        return true;
      } catch {
        return false;
      }
    };

    const resolveFromIp = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) return;
        const data = await response.json();
        const lat = data.latitude ?? data.lat;
        const lon = data.longitude ?? data.lon;
        if (typeof lat === 'number' && typeof lon === 'number') {
          await setResolvedCity(lat, lon, data.city);
        }
      } catch {
        // Ignore IP lookup errors; user can still search manually
      }
    };

    (async () => {
      const hasGeo = await resolveFromGeolocation();
      if (!hasGeo) {
        await resolveFromIp();
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [currentLocationCity]);

  return currentLocationCity;
};
