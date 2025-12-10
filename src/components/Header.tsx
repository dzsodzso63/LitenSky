import clsx from 'clsx';
import CitySearch from './CitySearch';

type HeaderProps = {
  textColorClass?: string;
};

const Header = ({ textColorClass = 'text-gray-900' }: HeaderProps) => {
  return (
    <header className="p-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img
          src="/favicon.svg"
          alt="LitenSky"
          className="w-10 h-10 md:w-12 md:h-12"
        />
        <h1 className={clsx('hidden sm:block text-3xl md:text-4xl font-bold leading-tight', textColorClass)}>
          LitenSky
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <CitySearch />
      </div>
    </header>
  );
};

export default Header;
