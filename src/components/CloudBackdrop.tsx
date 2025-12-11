import { useMemo } from 'react';
import { useWeather } from '../contexts/WeatherContext';

type CloudPatch = {
  id: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
  blur: number;
  duration: number;
  delay: number;
  start: number;
  end: number;
};

const CloudBackdrop = () => {
  const { weatherData, timeOfDay } = useWeather();

  const cloudCover = weatherData?.data.values.cloudCover ?? 0;
  const windSpeed = weatherData?.data.values.windSpeed ?? 0;
  const normalizedCover = Math.min(1, Math.max(0, cloudCover / 100));

  const clouds = useMemo<CloudPatch[]>(() => {
    if (normalizedCover < 0.05) return [];

    const count = Math.round(6 + normalizedCover * 12);
    const speedBoost = 1 + Math.min(1000, windSpeed * 0.5);
    return Array.from({ length: count }, (_, idx) => {
      const layer = Math.random();
      const width = 24 + Math.random() * 26 + normalizedCover * 10;
      const height = 19 + Math.random() * 20 + (1 - layer) * 4;
      const top = 1 + layer * 20 + Math.random() * 30;
      const opacity = Math.min(0.8, 0.18 + normalizedCover * 0.45 + (1 - layer) * 0.1);
      const blur = 16 + layer * 12 + Math.random() * 4;
      const baseDuration = 96 - normalizedCover * 10 + layer * 8 + Math.random() * 3;
      const duration = Math.max(8, baseDuration / speedBoost);
      const delay = -(Math.random() * duration);
      const start = -40 - Math.random() * 25;
      const end = 120 + Math.random() * 25 + normalizedCover * 10;

      return {
        id: idx,
        top,
        width,
        height,
        opacity,
        blur,
        duration,
        delay,
        start,
        end,
      };
    });
  }, [normalizedCover, windSpeed]);

  if (clouds.length === 0) return null;

  const colorStops = (() => {
    if (timeOfDay === 'night') {
      return {
        highlight: 'rgba(60,60,60,0.5)',
        base: 'rgba(15,18,18,0.65)',
      };
    }
    if (timeOfDay === 'sunrise') {
      return {
        highlight: 'rgba(255,244,230,0.85)',
        base: 'rgba(230,200,185,0.55)',
      };
    }
    if (timeOfDay === 'sunset') {
      return {
        highlight: 'rgba(255,240,235,0.8)',
        base: 'rgba(215,175,165,0.55)',
      };
    }
    return {
      highlight: 'rgba(255,255,255,0.42)',
      base: 'rgba(210,220,230,0.15)',
    };
  })();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes cloud-glide {
            0% {
              transform: translate3d(var(--start, -30vw), 0, 0);
            }
            100% {
              transform: translate3d(var(--end, 120vw), 0, 0);
            }
          }
        `}
      </style>

      {clouds.map((cloud) => (
        <span
          key={`cloud-${cloud.id}`}
          className="absolute rounded-full"
          style={{
            top: `${cloud.top}%`,
            left: 0,
            width: `${cloud.width}vw`,
            height: `${cloud.height}vh`,
            opacity: cloud.opacity,
            background: `radial-gradient(circle at 35% 30%, ${colorStops.highlight}, ${colorStops.base})`,
            filter: `blur(${cloud.blur}px)`,
            animation: `cloud-glide ${cloud.duration}s linear infinite`,
            animationDelay: `${cloud.delay}s`,
            ['--start' as any]: `${cloud.start}vw`,
            ['--end' as any]: `${cloud.end}vw`,
          }}
        />
      ))}
    </div>
  );
};

export default CloudBackdrop;
