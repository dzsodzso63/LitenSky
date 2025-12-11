import { useWeather } from '../contexts/WeatherContext';
import SettingsButton from './SettingsButton';

const Footer = () => {
  const { timeOfDay } = useWeather();
  const faviconSrc = timeOfDay === 'night' ? '/favicon_night.svg' : '/favicon.svg';
  return (
    <footer
      className="py-4 px-6 bg-time-bg/30 backdrop-blur-sm text-time-text/80"
    >
      <div className="flex items-center lg:gap-6 lg:flex-row gap-2 flex-col text-base">
        <p className="flex items-center gap-2 font-semibold">
          <img
            src={faviconSrc}
            alt="LitenSky logo"
            className="w-6 h-6 md:w-8 md:h-8"
          />LitenSky</p>
        <p className="mt-1">
          Powered by{' '}
          <a
            href="https://www.tomorrow.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-time-text"
          >
            Tomorrow.io
          </a>
        </p>
        <p className="mt-2">
          Coded by:{' '}
          <a
            href="https://github.com/dzsodzso63"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-time-text"
          >
            Dzso
          </a>
        </p>
        <p className="mt-2">
          <a
            href="https://github.com/dzsodzso63/LitenSky"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-time-text"
          >
            Source code
          </a>
        </p>
        <p className="mt-2">
          <a
            href="/storybook/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-time-text"
          >
            View Storybook
          </a>
        </p>
        <div className="lg:ml-auto">
          <SettingsButton />
        </div>
      </div>
    </footer >
  );
};

export default Footer;
