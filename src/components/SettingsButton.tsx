import { useSettings } from '../contexts/SettingsContext';

const SettingsButton = () => {
  const { unit, setUnit } = useSettings();

  return (
    <div>
      <div className="flex gap-2 p-1 rounded-lg border border-time-text/30">
        <button
          onClick={() => setUnit('metric')}
          className={`px-3 py-1 rounded text-sm transition-colors ${unit === 'metric'
            ? 'bg-time-text text-time-bg'
            : 'bg-time-bg text-time-text cursor-pointer hover:scale-102'
            }`}
        >
          Metric (°C)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-3 py-1 rounded text-sm transition-colors ${unit === 'imperial'
            ? 'bg-time-text text-time-bg'
            : 'bg-time-bg text-time-text cursor-pointer hover:scale-102'
            }`}
        >
          Imperial (°F)
        </button>
      </div>
    </div>

  );
};

export default SettingsButton;

