import { WeatherProvider, useWeather } from './contexts/WeatherContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CityImageBackdrop from './components/CityImageBackdrop';
import CloudBackdrop from './components/CloudBackdrop';
import RainBackdrop from './components/RainBackdrop';
import SelectedCityDetails from './components/SelectedCityDetails';
import RecentCityList from './components/RecentCityList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTimeOfDayColors } from './hooks/useTimeOfDayColors';
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
  useTimeOfDayColors(timeOfDay);

  return (
    <div className={clsx(
      'min-h-screen transition-all duration-1000 flex flex-col relative overflow-hidden',
      'bg-time-bg'
    )}>
      <CityImageBackdrop cityImage={cityImage} />
      <CloudBackdrop />
      <RainBackdrop />
      <div className="relative z-10 flex-1 flex flex-col">
        <Header />

        {/* Main Content */}
        <main className="container mx-auto px-6 py-2 z-10 pb-12 flex-1 min-h-[800px]">
          <SelectedCityDetails />
          <RecentCityList />
        </main>

        <Footer />
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

