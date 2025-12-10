import { WeatherProvider, useWeather } from './contexts/WeatherContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CityImageBackdrop from './components/CityImageBackdrop';
import RainBackdrop from './components/RainBackdrop';
import SelectedCityDetails from './components/SelectedCityDetails';
import RecentCityList from './components/RecentCityList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
  const { timeOfDay, cityImage } = useWeather();

  const gradientClass = ({
    night: 'from-slate-800 to-slate-900',
    sunrise: 'from-amber-50 to-orange-50',
    day: 'from-blue-400 to-blue-300',
    sunset: 'from-orange-200 to-indigo-300',
  } as const)[timeOfDay] || 'from-blue-400 to-blue-300';

  const textColorClass = 'text-gray-900';

  return (
    <div className={clsx(
      'min-h-screen bg-white bg-gradient-to-br transition-all duration-1000 flex flex-col relative overflow-hidden',
      gradientClass
    )}>
      <CityImageBackdrop cityImage={cityImage} />
      <RainBackdrop />
      <div className="relative z-10 flex-1 flex flex-col">
        <Header textColorClass={textColorClass} />

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12 z-10 pb-32 flex-1 min-h-[800px]">
          <SelectedCityDetails />
          <RecentCityList />
        </main>

        <Footer timeOfDay={timeOfDay} />
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

