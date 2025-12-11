import { WEATHER_ICON_MAP } from '../utils/weatherIconMap';
import type { TimeOfDay } from '../types/weather';

interface WeatherIconProps {
  weatherCode: number | undefined;
  className?: string;
  timeOfDay: TimeOfDay;
  size?: number;
}

const WeatherIcon = ({ weatherCode, timeOfDay, className = '', size = 64 }: WeatherIconProps) => {

  if (weatherCode === undefined || weatherCode === null) {
    return null;
  }

  const codeStr = weatherCode.toString();
  const iconInfo =
    timeOfDay === 'night'
      ? WEATHER_ICON_MAP[`${codeStr}1`] || WEATHER_ICON_MAP[`${codeStr}0`]
      : WEATHER_ICON_MAP[`${codeStr}0`];

  const iconFilename = iconInfo?.iconFileName;

  if (!iconFilename) {
    return null;
  }

  return (
    <img
      src={`/icons/${iconFilename}`}
      alt="Weather icon"
      className={`${className} max-w-full`}
      style={{ width: size, height: size, maxWidth: '100%', objectFit: 'contain' }}
    />
  );
};

export default WeatherIcon;
