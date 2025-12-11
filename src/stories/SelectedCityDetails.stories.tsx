import type { Meta, StoryObj } from '@storybook/react';
import SelectedCityDetails from '../components/SelectedCityDetails';
import { MockWeatherProvider, SettingsUnitProvider, createMockCity, createMockWeatherData } from './storyHelpers';
import type { TimeOfDay } from '../types/weather';

type StoryArgs = {
  timeOfDay: TimeOfDay;
  unit: 'metric' | 'imperial';
  cityName: string;
  timezone: string;
  weatherCode: number;
  temperature: number;
  temperatureApparent: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressureSeaLevel: number;
};

const meta: Meta<StoryArgs> = {
  title: 'Components/SelectedCityDetails',
  component: SelectedCityDetails,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    timeOfDay: {
      control: 'select',
      options: ['night', 'sunrise', 'day', 'sunset'],
    },
    unit: {
      control: 'select',
      options: ['metric', 'imperial'],
    },
    weatherCode: {
      control: { type: 'number', min: 1000, max: 8000, step: 1 },
      description: 'Weather code passed to the icon and description',
    },
    temperature: {
      control: { type: 'number', min: -30, max: 50, step: 1 },
    },
    temperatureApparent: {
      control: { type: 'number', min: -30, max: 50, step: 1 },
    },
    precipitationProbability: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    windSpeed: {
      control: { type: 'range', min: 0, max: 25, step: 0.5 },
    },
    windDirection: {
      control: { type: 'range', min: 0, max: 360, step: 5 },
    },
    humidity: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    pressureSeaLevel: {
      control: { type: 'number', min: 950, max: 1050, step: 1 },
      description: 'Sea level pressure in hPa',
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
    timeOfDay: 'day',
    unit: 'metric',
    cityName: 'New York',
    timezone: 'America/New_York',
    weatherCode: 1001,
    temperature: 24,
    temperatureApparent: 26,
    precipitationProbability: 35,
    windSpeed: 4.5,
    windDirection: 200,
    humidity: 68,
    pressureSeaLevel: 1011,
  },
  render: ({
    timeOfDay,
    unit,
    cityName,
    timezone,
    weatherCode,
    temperature,
    temperatureApparent,
    precipitationProbability,
    windSpeed,
    windDirection,
    humidity,
    pressureSeaLevel,
  }) => {
    const city = createMockCity({ name: cityName, timezone });
    const weatherData = createMockWeatherData({
      weatherCode,
      temperature,
      temperatureApparent,
      precipitationProbability,
      windSpeed,
      windDirection,
      humidity,
      pressureSeaLevel,
    });

    return (
      <SettingsUnitProvider unit={unit}>
        <MockWeatherProvider city={city} weatherData={weatherData} timeOfDay={timeOfDay}>
          <div className="p-6 bg-time-bg/30 border border-time-text/30 rounded-2xl">
            <SelectedCityDetails />
          </div>
        </MockWeatherProvider>
      </SettingsUnitProvider>
    );
  },
};
