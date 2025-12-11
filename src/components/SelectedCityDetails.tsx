import { useWeather } from '../contexts/WeatherContext';
import { useSettings } from '../contexts/SettingsContext';
import { convertTemperature } from '../utils/temperature';
import { WEATHER_ICON_MAP } from '../utils/weatherIconMap';
import WeatherIcon from './WeatherIcon';
import LocalTimeDisplay from './LocalTimeDisplay';
import type { TimeOfDay } from '../types/weather';
import { useEffect, useRef } from 'react';

// Helper function to extract weather text from icon filename
const getWeatherText = (weatherCode: number, timeOfDay: TimeOfDay): string => {
  const codeStr = weatherCode.toString();
  const iconInfo =
    timeOfDay === 'night'
      ? WEATHER_ICON_MAP[`${codeStr}1`] || WEATHER_ICON_MAP[`${codeStr}0`]
      : WEATHER_ICON_MAP[`${codeStr}0`];

  if (!iconInfo?.iconFileName) return '';

  const filename = iconInfo.iconFileName;
  const match = filename.match(/^\d+_(.+?)_large\.svg$/);
  if (match) {
    return match[1]
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return '';
};

const SelectedCityDetails = () => {
  const { timeOfDay, city, weatherData } = useWeather();
  const { unit } = useSettings();
  const detailsRef = useRef<HTMLDivElement>(null);

  // Scroll to details when a city is selected
  useEffect(() => {
    if (city && detailsRef.current) {
      const elementTop = detailsRef.current.getBoundingClientRect().top + window.scrollY - 20;
      const currentScroll = window.scrollY;

      // Only scroll if we're below the target position
      if (currentScroll > elementTop) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [city]);

  if (!city) return null;

  if (!weatherData) {
    return (
      <div ref={detailsRef} className="text-center mb-6">
        <h2 className="text-3xl font-semibold text-time-text">{city.name}</h2>
      </div>
    );
  }

  const { values } = weatherData.data;
  const feelsLikeTemperature = convertTemperature(values.temperatureApparent, unit);
  const precipitationProbability = Math.round(values.precipitationProbability);
  const windSpeed = unit === 'imperial' ? Math.round(values.windSpeed * 2.23694) : Math.round(values.windSpeed);
  const windSpeedUnit = unit === 'imperial' ? 'mph' : 'm/s';
  const pressure =
    unit === 'imperial'
      ? Math.round(values.pressureSeaLevel * 0.02953 * 100) / 100 // convert hPa to inHg
      : Math.round(values.pressureSeaLevel);
  const pressureUnit = unit === 'imperial' ? 'inHg' : 'hPa';
  const windDirectionRotation = values.windDirection + 180; // rotate arrow to indicate origin (pointing from source)

  return (
    <div ref={detailsRef} className="mb-2 pb-6">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-0">
          {values.weatherCode && (
            <div className="sm:max-w-[280px] max-w-full">
              <WeatherIcon
                weatherCode={values.weatherCode}
                timeOfDay={timeOfDay}
                size={280}
                className="drop-shadow-lg max-w-full h-auto"
              />
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-time-text">{city.name}</h2>
              <LocalTimeDisplay city={city} className="" />
            </div>
            <div className="text-8xl font-bold leading-none text-time-text">
              {convertTemperature(values.temperature, unit)}°
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-1 min-w-[380px] text-time-text text-base">
          {values.weatherCode && (
            <div className="font-semibold mb-1">
              {getWeatherText(values.weatherCode, timeOfDay)}
            </div>
          )}

          <hr className="border-time-text opacity-20 my-2 w-full" />

          <div className="flex items-center justify-between">
            <span className="opacity-80">Feels Like</span>
            <span className="font-semibold">{feelsLikeTemperature}°</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="opacity-80">Humidity</span>
            <span className="font-semibold">{values.humidity}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="topacity-80">Precipitation</span>
            <span className="font-semibold">{precipitationProbability}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="opacity-80">Pressure</span>
            <span className="font-semibold">
              {pressure} {pressureUnit}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="opacity-80">Wind</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {windSpeed} {windSpeedUnit}
              </span>
              <span
                className="inline-flex items-center justify-center w-7 h-7 text-lg"
                style={{ transform: `rotate(${windDirectionRotation}deg)` }}
                aria-label="Wind direction"
              >
                ↑
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedCityDetails;
