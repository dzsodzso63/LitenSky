import { useSettings } from '../contexts/SettingsContext';

const SettingsButton = () => {
  const { unit, setUnit } = useSettings();

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('metric')}
          className={`px-3 py-1 rounded text-sm transition-colors ${unit === 'metric'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Metric (°C)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-3 py-1 rounded text-sm transition-colors ${unit === 'imperial'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Imperial (°F)
        </button>
      </div>
    </div>

  );
};

export default SettingsButton;

