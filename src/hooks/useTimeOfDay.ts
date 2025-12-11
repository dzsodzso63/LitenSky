import { useState, useEffect } from 'react';
import { calculateTimeOfDay } from '../utils/weather';
import type { City, TimeOfDay } from '../types/weather';

export const useTimeOfDay = (city: City | null): TimeOfDay => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');

  useEffect(() => {
    if (!city) {
      return;
    }

    const updateTimeOfDay = () => {
      const newTimeOfDay = calculateTimeOfDay(city.latitude, city.longitude);
      setTimeOfDay(newTimeOfDay);
    };

    updateTimeOfDay();

    const interval = setInterval(updateTimeOfDay, 60 * 1000);

    return () => clearInterval(interval);
  }, [city]);

  return timeOfDay;
};
