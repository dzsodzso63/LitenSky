import { useState, useEffect } from 'react';
import type { City } from '../types/weather';

export interface LocalTimeResult {
  time: string;
  offset: number | null;
}

export const useLocalTime = (city: City | null): LocalTimeResult => {
  const [localTime, setLocalTime] = useState<string>('');
  const [offset, setOffset] = useState<number | null>(null);

  useEffect(() => {
    if (!city || !city.timezone) {
      setLocalTime('');
      setOffset(null);
      return;
    }

    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: city.timezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        setLocalTime(formatter.format(now));

        // Calculate timezone offset: compare hours in city vs user timezone
        const cityHour = parseInt(
          new Intl.DateTimeFormat('en-US', {
            timeZone: city.timezone,
            hour: 'numeric',
            hour12: false,
          }).format(now),
          10
        );
        const userHour = parseInt(
          new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: false,
          }).format(now),
          10
        );

        let diff = cityHour - userHour;
        // Handle day boundary (e.g., city 23:00 vs user 01:00 = -22, not +2)
        if (diff > 12) diff -= 24;
        if (diff < -12) diff += 24;
        setOffset(diff);
      } catch {
        setLocalTime('');
        setOffset(null);
      }
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [city]);

  return { time: localTime, offset };
};
