import type { Meta, StoryObj } from '@storybook/react';
import RainBackdrop from '../components/RainBackdrop';
import CityImageBackdrop from '../components/CityImageBackdrop';
import { useTimeOfDayColors } from '../hooks/useTimeOfDayColors';
import defaultCityImage from './assets/city_photo.jpg';
import { MockWeatherProvider, createMockWeatherData } from './storyHelpers';

type StoryArgs = {
  rainIntensity: number;
  snowIntensity: number;
  windSpeed: number;
  timeOfDay: 'night' | 'sunrise' | 'day' | 'sunset';
};

const meta: Meta<StoryArgs> = {
  title: 'Components/RainBackdrop',
  component: RainBackdrop,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    rainIntensity: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Mocked rain intensity (mm/hr scale)',
    },
    snowIntensity: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Mocked snow intensity (mm/hr scale)',
    },
    windSpeed: {
      control: { type: 'range', min: 0, max: 20, step: 0.5 },
      description: 'Wind speed influencing drift (m/s)',
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
    rainIntensity: 1.4,
    snowIntensity: 0,
    windSpeed: 4,
    timeOfDay: 'day',
  },
  render: ({ rainIntensity, snowIntensity, windSpeed, timeOfDay }) => {
    const weatherData = createMockWeatherData({
      rainIntensity,
      snowIntensity,
      windSpeed,
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
            <RainBackdrop />
            <div className="relative z-10 p-10 rounded-2xl border border-time-text/30 backdrop-blur-md bg-time-bg/20 w-max-xl mx-auto">
              <h2 className="text-3xl font-semibold mb-2">Rain & Snow Preview</h2>
              <p className="text-time-text/70">
                Adjust the controls to tune intensity and wind drift.
              </p>
            </div>
          </div>
        </Wrapper>
      </MockWeatherProvider>
    );
  },
};
