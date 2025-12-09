import { WeatherProvider, useWeather } from './contexts/WeatherContext';
import { SettingsProvider } from './contexts/SettingsContext';
import SettingsButton from './components/SettingsButton';
import CitySearch from './components/CitySearch';
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
      {cityImage && (
        /* PARENT: Controls the "Window" size (cropped on mobile, full on desktop) */
        <div className="fixed top-0 left-0 right-0 z-0 h-[65vh] h-screen blur-xs opacity-30 overflow-hidden pointer-events-none">

          {/* CHILD: The Image */
            /* We force 'h-screen' here so the image scale remains constant/parallax-ready */
            /* even when the parent window gets smaller on mobile. */
          }
          <div
            className="absolute top-0 left-0 right-0 h-screen"
            style={{
              backgroundImage: `url("${cityImage}")`,
              backgroundSize: 'cover',
              /* 50% (X): Centers horizontally (fixes Eiffel Tower side-crop)
                35% (Y): Focuses lower down (hides the top sky/air you didn't like) 
              */
              backgroundPosition: '50% 35%',
              maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)'
            }}
          />

          {/* OVERLAY: Optional tint if you need text contrast */}
          {/* Note: I removed the bottom gradient here because the maskImage above handles the fade efficiently */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
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
            <h1 className={clsx('hidden sm:block text-3xl md:text-4xl font-bold leading-tight', textColorClass)}>LitenSky</h1>
          </div>
          <div className="flex items-center gap-4">
            <CitySearch />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12 z-10 pb-32 flex-1 min-h-[800px]">
          <SelectedCityDetails />
          <RecentCityList />
        </main>

        {/* Footer with Attribution and Settings */}
        <footer className={clsx('fixed bottom-0 left-0 right-0 py-2 px-6 backdrop-blur-sm z-20', timeOfDay === 'night' ? 'bg-white/30' : 'bg-white/60')}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
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

