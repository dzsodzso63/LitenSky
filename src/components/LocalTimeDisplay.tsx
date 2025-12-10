import { useLocalTime } from '../hooks/useLocalTime';
import type { City } from '../types/weather';

interface LocalTimeDisplayProps {
  city: City | null;
  className?: string;
}

const LocalTimeDisplay = ({ city, className = '' }: LocalTimeDisplayProps) => {
  const { time: localTime, offset } = useLocalTime(city);

  if (!localTime) return null;

  return (
    <div className={`text-sm text-time-text/70 ${className}`}>
      {localTime}
      {offset !== null && offset !== 0 && (
        <sup className="text-xs ml-0.5">
          ({offset > 0 ? '+' : ''}{offset})
        </sup>
      )}
    </div>
  );
};

export default LocalTimeDisplay;
