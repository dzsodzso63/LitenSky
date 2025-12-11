import type { Meta, StoryObj } from '@storybook/react';
import RecentCityList from '../components/RecentCityList';
import { MockWeatherProvider, SettingsUnitProvider, createMockCityWeather } from './storyHelpers';
import type { CityWeather, TimeOfDay } from '../types/weather';

type StoryArgs = {
  recentCities: CityWeather[];
  timeOfDay: TimeOfDay;
};

const meta: Meta<StoryArgs> = {
  title: 'Components/RecentCityList',
  component: RecentCityList,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    recentCities: {
      control: 'object',
      description: 'Mocked recent city weather entries',
    },
    timeOfDay: {
      control: 'select',
      options: ['night', 'sunrise', 'day', 'sunset'],
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

const log = (name: string) => (...args: unknown[]) => {
  // eslint-disable-next-line no-console
  console.log(name, ...args);
};

export const Default: Story = {
  args: {
    timeOfDay: 'day',
    recentCities: [
      createMockCityWeather({
        city: { name: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
        timeOfDay: 'day',
        weatherOverrides: { weatherCode: 1000, temperature: 22 },
      }),
      createMockCityWeather({
        city: { name: 'London', latitude: 51.5072, longitude: -0.1276, timezone: 'Europe/London' },
        timeOfDay: 'sunset',
        weatherOverrides: { weatherCode: 1100, temperature: 16 },
      }),
      createMockCityWeather({
        city: { name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
        timeOfDay: 'night',
        weatherOverrides: { weatherCode: 4000, temperature: 18, rainIntensity: 0.8 },
      }),
      createMockCityWeather({
        city: { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
        timeOfDay: 'sunrise',
        weatherOverrides: { weatherCode: 5001, temperature: 12, snowIntensity: 0.6 },
      }),
    ],
  },
  render: ({ recentCities, timeOfDay }) => (
    <div className="p-8 bg-time-bg/20 text-time-text min-h-screen">
      <SettingsUnitProvider>
        <MockWeatherProvider
          timeOfDay={timeOfDay}
          recentCities={recentCities}
          setCity={log('setCity')}
          removeCityFromRecents={log('removeCityFromRecents')}
        >
          <RecentCityList />
        </MockWeatherProvider>
      </SettingsUnitProvider>
    </div>
  ),
};
