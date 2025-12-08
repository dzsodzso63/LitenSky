import { useSettings } from '../contexts/SettingsContext';
import { useWeather } from '../contexts/WeatherContext';

const SettingsButton = () => {
  const { isSettingsOpen, setIsSettingsOpen, unit, setUnit } = useSettings();
  const { clearRecentCities, recentCities } = useWeather();

  return (
    <div className="relative">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="p-2 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {isSettingsOpen && (
        <div className="absolute bottom-12 right-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 min-w-[220px] z-50">
          <h3 className="font-semibold text-gray-800 mb-3">Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature Unit
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUnit('metric')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    unit === 'metric'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Metric (°C)
                </button>
                <button
                  onClick={() => setUnit('imperial')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    unit === 'imperial'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Imperial (°F)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recent Cities
              </label>
              <button
                onClick={() => {
                  clearRecentCities();
                  setIsSettingsOpen(false);
                }}
                disabled={recentCities.length === 0}
                className={`w-full px-3 py-2 rounded text-sm transition-colors ${
                  recentCities.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Clear Recent Cities
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;

