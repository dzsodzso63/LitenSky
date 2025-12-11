import { useWeather } from '../contexts/WeatherContext';
import { useSettings } from '../contexts/SettingsContext';
import { convertTemperature } from '../utils/temperature';
import WeatherIcon from './WeatherIcon';
import LocalTimeDisplay from './LocalTimeDisplay';
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

  const displayTimeOfDay = timeOfDay || currentTimeOfDay;

  const bgClass = 'bg-time-bg/20';
  const borderClass = 'border-time-text/30';

  if (isLoading) {
    return (
      <div
        className={clsx(
          'backdrop-blur-md rounded-xl p-4 border cursor-pointer transition-all hover:scale-105',
          borderClass,
          bgClass
        )}
      >
        <div className="text-center text-time-text">
          <p className="text-base font-semibold">{city.name}</p>
          <p className="text-xs opacity-70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div
        className={clsx(
          'backdrop-blur-md rounded-xl p-4 border cursor-pointer transition-all hover:scale-105',
          borderClass,
          bgClass
        )}
      >
        <div className="text-center text-time-text">
          <p className="text-base font-semibold">{city.name}</p>
          <p className="text-xs opacity-70">No weather data</p>
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
        'backdrop-blur-md rounded-xl p-4 pr-6 border cursor-pointer transition-all hover:scale-105 relative',
        borderClass,
        bgClass
      )}
    >
      {!isCurrent && (
        <button
          onClick={handleRemove}
          className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-time-text hover:text-time-text/80 text-sm font-bold transition-all z-10 cursor-pointer hover:scale-125"
          aria-label="Remove city"
          title="Remove city"
        >
          ×
        </button>
      )}
      <div className="flex items-center gap-4">
        {weatherCode && (
          <WeatherIcon
            weatherCode={weatherCode}
            timeOfDay={displayTimeOfDay}
            size={72}
            className="drop-shadow-lg"
          />
        )}

        <div className="flex flex-col justify-between min-h-[72px]">
          <div className="flex gap-3 items-baseline">
            <h3 className="text-lg text-time-text max-w-[140px] truncate">{city.name}</h3>
            {isCurrent ? (
              <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded-full">
                Current
              </span>
            ) :
              <LocalTimeDisplay city={city} className="text-nowrap whitespace-nowrap" />}
          </div>
          <div className="text-3xl font-bold text-time-text text-nowrap whitespace-nowrap">
            {temperature}°
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
