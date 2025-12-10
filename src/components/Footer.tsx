import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import SettingsButton from './SettingsButton';

type FooterProps = {
  timeOfDay?: string | null;
};

const Footer = ({ timeOfDay }: FooterProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoButtonRef = useRef<HTMLButtonElement | null>(null);
  const infoPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isInfoOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        infoPanelRef.current &&
        !infoPanelRef.current.contains(target) &&
        infoButtonRef.current &&
        !infoButtonRef.current.contains(target)
      ) {
        setIsInfoOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isInfoOpen]);

  return (
    <footer
      className={'py-2 px-6 bg-time-bg/50 backdrop-blur-sm'}
    >
      <div className="relative flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            ref={infoButtonRef}
            type="button"
            onClick={() => setIsInfoOpen((prev) => !prev)}
            className="rounded-full border border-gray-300 bg-white/70 px-3 py-1 text-sm text-gray-800 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-expanded={isInfoOpen}
            aria-controls="liten-info-panel"
          >
            Info
          </button>
          {isInfoOpen && (
            <div
              ref={infoPanelRef}
              id="liten-info-panel"
              className="absolute bottom-12 left-0 w-72 rounded-lg border border-gray-200 bg-white/90 p-4 text-sm text-gray-800 shadow-lg backdrop-blur"
            >
              <p className="font-semibold text-gray-900">LitenSky</p>
              <p className="mt-1">
                Powered by{' '}
                <a
                  href="https://www.tomorrow.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-900"
                >
                  Tomorrow.io
                </a>{' '}
                weather data.
              </p>
              <p className="mt-2">
                Coded by{' '}
                <a
                  href="https://github.com/dzsodzso63"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-900"
                >
                  dzsodzso63
                </a>
                .
              </p>
              <p className="mt-2">
                Source code:{' '}
                <a
                  href="https://github.com/dzsodzso63/LitenSky"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-900"
                >
                  github.com/dzsodzso63/LitenSky
                </a>
              </p>
              <p className="mt-2">
                <a
                  href="/storybook/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-900"
                >
                  View Storybook
                </a>
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <SettingsButton />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
