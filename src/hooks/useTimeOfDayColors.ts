import { useEffect } from 'react';
import type { TimeOfDay } from '../types/weather';

// Time-of-day color definitions
// Each timeOfDay has one background color and one text color with good contrast
const timeOfDayColors: Record<TimeOfDay, { bg: string; text: string }> = {
  night: {
    bg: '#1e293b', // slate-800
    text: '#ffffff', // white
  },
  sunrise: {
    bg: '#fef3c7', // amber-100
    text: '#111827', // gray-900
  },
  day: {
    bg: '#60a5fa', // blue-400
    text: '#111827', // gray-900
  },
  sunset: {
    bg: '#b5aa8f', // orange-500
    text: '#111827', // gray-900
  },
};

export const useTimeOfDayColors = (timeOfDay: TimeOfDay) => {
  // Set CSS variables based on timeOfDay
  useEffect(() => {
    const colors = timeOfDayColors[timeOfDay];
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--time-bg', colors.bg);
      document.documentElement.style.setProperty('--time-text', colors.text);
    }
  }, [timeOfDay]);
};
