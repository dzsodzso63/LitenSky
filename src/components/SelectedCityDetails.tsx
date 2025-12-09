import { useWeather } from '../contexts/WeatherContext';
import { useSettings } from '../contexts/SettingsContext';
import { convertTemperature } from '../utils/temperature';
import { WEATHER_ICON_MAP } from '../utils/weatherIconMap';
import WeatherIcon from './WeatherIcon';
import type { TimeOfDay } from '../types/weather';
import clsx from 'clsx';

// Helper function to extract weather text from icon filename
const getWeatherText = (weatherCode: number, timeOfDay: TimeOfDay): string => {
  const codeStr = weatherCode.toString();
  const iconInfo =
    timeOfDay === 'night'
      ? WEATHER_ICON_MAP[`${codeStr}1`] || WEATHER_ICON_MAP[`${codeStr}0`]
      : WEATHER_ICON_MAP[`${codeStr}0`];
  
  if (!iconInfo?.iconFileName) return '';
  
  // Extract description from filename: {code}_{description}_large@2x.png
  const filename = iconInfo.iconFileName;
  const match = filename.match(/^\d+_(.+?)_large@2x\.png$/);
  if (match) {
    // Replace underscores with spaces and capitalize words
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

  const textColorClass = 'text-gray-900';

  if (!city) return null;

  if (!weatherData) {
    return (
      <div className="text-center mb-6">
        <h2 className={clsx('text-3xl font-semibold', textColorClass)}>{city.name}</h2>
      </div>
    );
  }

  return (
    <div className="mb-10 pb-12">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        <div className="flex items-center gap-4">
          {weatherData.data.values.weatherCode && (
            <WeatherIcon
              weatherCode={weatherData.data.values.weatherCode}
              timeOfDay={timeOfDay}
              size={180}
              className="drop-shadow-lg"
            />
          )}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">{city.name}</h2>
            <div className="text-8xl font-bold leading-none">
              {convertTemperature(weatherData.data.values.temperature, unit)}°
            </div>
          </div>
        </div>

        <div
          className={clsx(
            'backdrop-blur-md rounded-xl p-4 border flex flex-col gap-3 shadow-sm min-w-[220px]',
            timeOfDay === 'night' ? 'bg-white/15 border-white/30 text-white' : 'bg-white/50 border-gray-200/70',
            textColorClass
          )}
        >
          {weatherData.data.values.weatherCode && (
            <div className="text-base font-semibold mb-1">
              {getWeatherText(weatherData.data.values.weatherCode, timeOfDay)}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">Humidity</span>
            <span className="text-lg font-semibold">{weatherData.data.values.humidity}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">Wind</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {Math.round(weatherData.data.values.windSpeed)} m/s
              </span>
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-current text-sm"
                style={{ transform: `rotate(${weatherData.data.values.windDirection}deg)` }}
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
