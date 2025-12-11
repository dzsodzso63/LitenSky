import CitySearch from './CitySearch';
import { useWeather } from '../contexts/WeatherContext';

const Header = () => {
  const { timeOfDay } = useWeather();
  const faviconSrc = timeOfDay === 'night' ? '/favicon_night.svg' : '/favicon.svg';

  return (
    <header className="p-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img
          src={faviconSrc}
          alt="LitenSky logo"
          className="w-10 h-10 md:w-12 md:h-12"
        />
        <h1 className="hidden sm:block text-3xl md:text-4xl font-bold leading-tight text-time-text">
          LitenSky
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <CitySearch />
      </div>
    </header>
  );
};

export default Header;
