import { useWeather } from '../contexts/WeatherContext';
import WeatherCard from './WeatherCard';

const RecentCityList = () => {
  const { recentCities, setCity } = useWeather();

  if (recentCities.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-time-text mb-6">Recent Cities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recentCities.map((cityWeather) => (
          <WeatherCard
            key={`${cityWeather.city.latitude}-${cityWeather.city.longitude}`}
            cityWeather={cityWeather}
            onClick={() => setCity(cityWeather.city)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentCityList;
