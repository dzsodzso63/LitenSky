import type { Meta, StoryObj } from '@storybook/react';
import WeatherCard from '../components/WeatherCard';
import { MockWeatherProvider, SettingsUnitProvider, createMockCityWeather } from './storyHelpers';
import type { TimeOfDay } from '../types/weather';
import type { CityWeather } from '../types/weather';

type StoryArgs = {
  cityWeather: CityWeather;
  onClick?: () => void;
  unit: 'metric' | 'imperial';
  timeOfDay: TimeOfDay;
  cityName: string;
  timezone: string;
  temperature: number;
  weatherCode: number;
  isLoading: boolean;
  isCurrent: boolean;
};

const meta: Meta<StoryArgs> = {
  title: 'Components/WeatherCard',
  component: WeatherCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    unit: {
      control: 'select',
      options: ['metric', 'imperial'],
    },
    timeOfDay: {
      control: 'select',
      options: ['night', 'sunrise', 'day', 'sunset'],
    },
    temperature: {
      control: { type: 'number', min: -30, max: 45, step: 1 },
    },
    weatherCode: {
      control: { type: 'number', min: 1000, max: 8000, step: 1 },
    },
    isLoading: {
      control: 'boolean',
    },
    isCurrent: {
      control: 'boolean',
    },
    cityName: {
      control: 'text',
    },
    timezone: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  args: {
    cityWeather: createMockCityWeather({
      city: { name: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
      timeOfDay: 'day',
      isLoading: false,
      isCurrent: false,
      weatherOverrides: { temperature: 23, weatherCode: 1000 },
    }),
    unit: 'metric',
    timeOfDay: 'day',
    cityName: 'New York',
    timezone: 'America/New_York',
    temperature: 23,
    weatherCode: 1000,
    isLoading: false,
    isCurrent: false,
  },
  render: ({ unit, timeOfDay, cityName, timezone, temperature, weatherCode, isLoading, isCurrent, onClick }) => {
    const log = (name: string) => (...args: unknown[]) => {
      // eslint-disable-next-line no-console
      console.log(name, ...args);
    };

    const cityWeather = createMockCityWeather({
      city: { name: cityName, latitude: 40.7128, longitude: -74.006, timezone },
      timeOfDay,
      isLoading,
      isCurrent,
      weatherOverrides: { temperature, weatherCode },
    });

    return (
      <SettingsUnitProvider unit={unit}>
        <MockWeatherProvider
          timeOfDay={timeOfDay}
          removeCityFromRecents={log('removeCityFromRecents')}
        >
          <div className="p-6 bg-time-bg/30 rounded-2xl border border-time-text/30 w-[360px]">
            <WeatherCard cityWeather={cityWeather} onClick={onClick ?? log('cardClick')} />
          </div>
        </MockWeatherProvider>
      </SettingsUnitProvider>
    );
  },
};
