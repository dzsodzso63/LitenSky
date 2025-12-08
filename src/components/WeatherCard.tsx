import { useWeather } from '../contexts/WeatherContext';
import { useSettings } from '../contexts/SettingsContext';
import { convertTemperature } from '../utils/temperature';
import WeatherIcon from './WeatherIcon';
import clsx from 'clsx';
import type { CityWeather } from '../types/weather';

interface WeatherCardProps {
  cityWeather: CityWeather;
  onClick?: () => void;
}

const WeatherCard = ({ cityWeather, onClick }: WeatherCardProps) => {
  const { timeOfDay: currentTimeOfDay, removeCityFromRecents } = useWeather();
  const { unit } = useSettings();
  const { city, weatherData, timeOfDay, isLoading, isCurrent } = cityWeather;

  // Use the card's timeOfDay for styling, but fall back to current timeOfDay for icon if needed
  const displayTimeOfDay = timeOfDay || currentTimeOfDay;

  // Uniform transparent greyish background regardless of time of day
  const bgClass = 'bg-gray-300/20';
  
  // Uniform border and text color regardless of time of day
  const borderClass = 'border-gray-300/30';
  const textColorClass = 'text-gray-900';

  if (isLoading) {
    return (
      <div
        className={clsx(
          'backdrop-blur-md rounded-xl p-6 border cursor-pointer transition-all hover:scale-105',
          borderClass,
          bgClass
        )}
      >
        <div className={clsx('text-center', textColorClass)}>
          <p className="text-lg font-semibold mb-2">{city.city}</p>
          <p className="text-sm opacity-70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div
        className={clsx(
          'backdrop-blur-md rounded-xl p-6 border cursor-pointer transition-all hover:scale-105',
          borderClass,
          bgClass
        )}
      >
        <div className={clsx('text-center', textColorClass)}>
          <p className="text-lg font-semibold mb-2">{city.city}</p>
          <p className="text-sm opacity-70">No weather data</p>
        </div>
      </div>
    );
  }

  const temperature = convertTemperature(weatherData.data.values.temperature, unit);
  const weatherCode = weatherData.data.values.weatherCode;

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeCityFromRecents(city);
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'backdrop-blur-md rounded-xl p-6 border cursor-pointer transition-all hover:scale-105 relative',
        borderClass,
        bgClass
      )}
    >
      {!isCurrent && (
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-700 hover:text-gray-900 text-lg font-bold transition-all z-10 cursor-pointer hover:scale-125"
          aria-label="Remove city"
          title="Remove city"
        >
          ×
        </button>
      )}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <h3 className={clsx('text-xl font-semibold', textColorClass)}>{city.city}</h3>
          {isCurrent && (
            <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded-full">
              Current
            </span>
          )}
        </div>
        
        {weatherCode && (
          <WeatherIcon
            weatherCode={weatherCode}
            timeOfDay={displayTimeOfDay}
            size={64}
            className="drop-shadow-lg"
          />
        )}
        
        <div className={clsx('text-3xl font-bold', textColorClass)}>
          {temperature}°
        </div>
        
        <div className={clsx('text-sm opacity-80', textColorClass)}>
          {weatherData.data.values.humidity}% humidity
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
