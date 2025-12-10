import { useMemo } from 'react';
import { useWeather } from '../contexts/WeatherContext';

type RainDrop = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  tilt: number;
};

type SnowFlake = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  sway: number;
};

const RainBackdrop = () => {
  const { weatherData, timeOfDay } = useWeather();

  const rainIntensity = weatherData?.data.values.rainIntensity ?? 0;
  const snowIntensity = weatherData?.data.values.snowIntensity ?? 0;
  const windSpeed = weatherData?.data.values.windSpeed ?? 0;

  const { drops, flakes } = useMemo(() => {
    // Wind pushes precipitation diagonally; clamp to keep it subtle.
    const windPush = Math.max(-120, Math.min(120, windSpeed * 10));

    // Rain
    const drops: RainDrop[] = (() => {
      if (rainIntensity <= 0.05) return [];
      const normalizedIntensity = Math.min(1, rainIntensity / 5);
      const dropCount = Math.min(260, Math.round(80 + normalizedIntensity * 220));

      return Array.from({ length: dropCount }, (_, idx) => {
        const left = Math.random() * 100;
        const size = 0.5 + Math.random() * 1.4;
        const duration = Math.max(1.6, 3.6 - normalizedIntensity * 1.5 - Math.random());
        const delay = -(Math.random() * 5);
        const drift = windPush + (Math.random() - 0.5) * 80;
        const tilt = -Math.max(-18, Math.min(18, drift / 8));

        return { id: idx, left, size, duration, delay, drift, tilt };
      });
    })();

    // Snow
    const flakes: SnowFlake[] = (() => {
      if (snowIntensity <= 0.05) return [];
      const normalizedIntensity = Math.min(1, snowIntensity / 3);
      const flakeCount = Math.min(200, Math.round(50 + normalizedIntensity * 180));

      return Array.from({ length: flakeCount }, (_, idx) => {
        const left = Math.random() * 100;
        const size = 0.6 + Math.random() * 1.6;
        const duration = 4 + Math.random() * 4 - normalizedIntensity * 1.5;
        const delay = -(Math.random() * 6);
        const drift = windPush / 2 + (Math.random() - 0.5) * 25;
        const sway = (Math.random() - 0.5) * 18;

        return { id: idx, left, size, duration: Math.max(3, duration), delay, drift, sway };
      });
    })();

    return { drops, flakes };
  }, [rainIntensity, snowIntensity, windSpeed]);

  if (drops.length === 0 && flakes.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden blur-xs opacity-70"
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes rain-fall {
            0% {
              transform: translate3d(0, -120%, 0) rotate(var(--tilt, -10deg));
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translate3d(var(--drift, 0px), 110vh, 0) rotate(var(--tilt, -10deg));
              opacity: 0.9;
            }
          }
          @keyframes snow-fall {
            0% {
              transform: translate3d(0, -120%, 0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translate3d(calc(var(--drift, 0px) + var(--sway, 0px)), 110vh, 0);
              opacity: 0.85;
            }
          }
        `}
      </style>

      {drops.map((drop) => (
        <span
          key={`rain-${drop.id}`}
          className="absolute block bg-white/80"
          style={{
            left: `${drop.left}%`,
            width: `${0.05 * drop.size}rem`,
            height: `${1.7 * drop.size}rem`,
            borderRadius: '9999px',
            opacity: timeOfDay === 'night' ? 0.6 : 0.4,
            filter: 'blur(0.2px)',
            animation: `rain-fall ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
            ['--drift' as any]: `${drop.drift}px`,
            ['--tilt' as any]: `${drop.tilt}deg`,
          }}
        />
      ))}

      {flakes.map((flake) => (
        <span
          key={`snow-${flake.id}`}
          className="absolute block bg-white"
          style={{
            left: `${flake.left}%`,
            width: `${0.1 * flake.size}rem`,
            height: `${0.1 * flake.size}rem`,
            borderRadius: '9999px',
            boxShadow: `0 0 8px rgba(255,255,255,0.8)`,
            opacity: timeOfDay === 'night' ? 0.75 : 0.6,
            filter: 'blur(0.3px)',
            animation: `snow-fall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            ['--drift' as any]: `${flake.drift}px`,
            ['--sway' as any]: `${flake.sway}px`,
          }}
        />
      ))}
    </div>
  );
};

export default RainBackdrop;
