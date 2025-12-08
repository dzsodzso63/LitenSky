import { WeatherProvider, useWeather } from './contexts/WeatherContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import SettingsButton from './components/SettingsButton';
import CitySearch from './components/CitySearch';
import WeatherIcon from './components/WeatherIcon';
import WeatherCard from './components/WeatherCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { convertTemperature } from './utils/temperature';
import clsx from 'clsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

export const AppContent = () => {
  const { timeOfDay, city, weatherData, cityImage, recentCities, setCity } = useWeather();
  const { unit } = useSettings();

  const gradientClass = ({
    night: 'from-slate-800 to-slate-900',
    sunrise: 'from-amber-50 to-orange-50',
    day: 'from-blue-400 to-blue-300',
    sunset: 'from-orange-200 to-indigo-300',
  }as const)[timeOfDay]  || 'from-blue-400 to-blue-300';

  const textColorClass = timeOfDay === 'night' 
    ? 'text-white' 
    : 'text-gray-900';

  return (
    <div className={clsx(
      'min-h-screen bg-white bg-gradient-to-br transition-all duration-1000 flex flex-col relative overflow-hidden',
      gradientClass
    )}>
      {cityImage && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-top blur-xs opacity-40 scale-[1.2] transition-opacity duration-700"
          style={{ backgroundImage: `url("${cityImage}")` }}
        />
      )}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/favicon.svg" 
              alt="LitenSky" 
              className="w-10 h-10 md:w-12 md:h-12"
            />
            <h1 className={clsx('text-3xl md:text-4xl font-bold leading-tight', textColorClass)}>LitenSky</h1>
          </div>
          <div className="flex items-center gap-4">
            <CitySearch />
          </div>
        </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 pb-32 flex-1 min-h-[800px]">
        {/* Current City Weather Display */}
        {city && weatherData && (
          <div className="text-center mb-8 pb-16">
            <h2 className={clsx('text-3xl font-semibold mb-4', textColorClass)}>{city.city}</h2>
            
            <div className="relative flex items-center justify-center mb-4 pb-8">
              {weatherData.data.values.weatherCode && (
                <WeatherIcon 
                  weatherCode={weatherData.data.values.weatherCode}
                  timeOfDay={timeOfDay}
                  size={180}
                  className="drop-shadow-lg"
                />
              )}
              
              <div className="absolute left-1/2 flex flex-col items-center translate-y-1/2">
                <div className={clsx('font-bold leading-none text-[120px]', textColorClass)}>
                  {convertTemperature(weatherData.data.values.temperature, unit)}°
                </div>
                <div className={clsx('text-xl mt-2', timeOfDay === 'night' ? 'text-white/80' : 'text-gray-700')}>
                  {weatherData.data.values.humidity}% humidity
                </div>
              </div>
            </div>
          </div>
        )}
        
        {city && !weatherData && (
          <div className="text-center mb-6">
            <h2 className={clsx('text-3xl font-semibold', textColorClass)}>{city.city}</h2>
          </div>
        )}

        {/* Weather Cards Container */}
        {recentCities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentCities.map((cityWeather) => (
              <WeatherCard
                key={`${cityWeather.city.latitude}-${cityWeather.city.longitude}`}
                cityWeather={cityWeather}
                onClick={() => setCity(cityWeather.city)}
              />
            ))}
          </div>
        )}
        {recentCities.length === 0 && (
          <div className={clsx('backdrop-blur-md rounded-xl p-6 border text-center', timeOfDay === 'night' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-200')}>
            <p className={clsx(timeOfDay === 'night' ? 'text-white/70' : 'text-gray-700')}>
              Search for cities to see weather cards here
            </p>
          </div>
        )}
      </main>

        {/* Footer with Attribution and Settings */}
        <footer className={clsx('fixed bottom-0 left-0 right-0 py-2 px-6 backdrop-blur-sm z-20', timeOfDay === 'night' ? 'bg-white/30' : 'bg-white/60')}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-700 text-sm">
              Powered by{' '}
              <a
                href="https://www.tomorrow.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-900 underline transition-colors"
              >
                Tomorrow.io
              </a>
            </p>
            <div className="flex justify-end">
              <SettingsButton />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <WeatherProvider>
          <AppContent />
        </WeatherProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default App;

