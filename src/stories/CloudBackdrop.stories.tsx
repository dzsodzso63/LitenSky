import type { Meta, StoryObj } from '@storybook/react';
import CloudBackdrop from '../components/CloudBackdrop';
import CityImageBackdrop from '../components/CityImageBackdrop';
import { useTimeOfDayColors } from '../hooks/useTimeOfDayColors';
import defaultCityImage from './assets/city_photo.jpg';
import { MockWeatherProvider, createMockWeatherData } from './storyHelpers';

type StoryArgs = {
  cloudCover: number;
  windSpeed: number;
  timeOfDay: 'night' | 'sunrise' | 'day' | 'sunset';
};

const meta: Meta<StoryArgs> = {
  title: 'Components/CloudBackdrop',
  component: CloudBackdrop,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    cloudCover: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Cloud cover percentage (0-100)',
    },
    windSpeed: {
      control: { type: 'range', min: 0, max: 25, step: 0.5 },
      description: 'Wind speed influences cloud glide speed (m/s)',
    },
    timeOfDay: {
      control: 'select',
      options: ['night', 'sunrise', 'day', 'sunset'],
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const WithControls: Story = {
  args: {
    cloudCover: 65,
    windSpeed: 6,
    timeOfDay: 'day',
  },
  render: ({ cloudCover, windSpeed, timeOfDay }) => {
    const weatherData = createMockWeatherData({
      cloudCover,
      windSpeed,
      weatherCode: 1100,
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      useTimeOfDayColors(timeOfDay);
      return children;
    };

    return (
      <MockWeatherProvider weatherData={weatherData} timeOfDay={timeOfDay}>
        <Wrapper>
          <div className="bg-time-bg text-time-text min-h-screen transition-all duration-1000 flex flex-col relative overflow-hidden">
            <CityImageBackdrop cityImage={defaultCityImage} />
            <CloudBackdrop />
            <div className="relative z-10 p-10 rounded-2xl border border-time-text/30 backdrop-blur-md bg-time-bg/20 w-max-xl mx-auto">
              <h2 className="text-3xl font-semibold mb-2">Cloud Cover Preview</h2>
              <p className="text-time-text/70">
                Adjust the cloud cover and time of day to see layered clouds drift across the scene.
              </p>
            </div>
          </div>
        </Wrapper>
      </MockWeatherProvider>
    );
  },
};
