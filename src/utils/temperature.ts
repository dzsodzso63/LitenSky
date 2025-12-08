/**
 * Utility functions for temperature conversion
 */

type Unit = 'metric' | 'imperial';

/**
 * Convert temperature from Celsius to the specified unit
 * @param celsius - Temperature in Celsius
 * @param unit - Unit to convert to ('metric' for Celsius, 'imperial' for Fahrenheit)
 * @returns Rounded temperature in the specified unit
 */
export const convertTemperature = (celsius: number, unit: Unit): number => {
  if (unit === 'imperial') {
    return Math.round((celsius * 9/5) + 32);
  }
  return Math.round(celsius);
};
