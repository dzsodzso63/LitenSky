import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppContent } from '../App';
import { WeatherContext, type WeatherContextType } from '../contexts/WeatherContext';
import type { WeatherData, City, TimeOfDay } from '../types/weather';
import { SettingsProvider } from '../contexts/SettingsContext';
import { WEATHER_ICON_MAP } from '../utils/weatherIconMap';

// Create a query client for stories
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Mock Weather Provider component
const MockWeatherProvider = ({
  children,
  weatherData,
  timeOfDay,
  city,
}: {
  children: React.ReactNode;
  weatherData: WeatherData | null;
  timeOfDay: TimeOfDay;
  city: City | null;
}) => {
  const mockContextValue: WeatherContextType = {
    weatherData,
    timeOfDay,
    city,
    cityImage: null,
    recentCities: [],
    setCity: () => {},
    clearRecentCities: () => {},
    isLoading: false,
    isCityImageLoading: false,
  };

  return (
    <WeatherContext.Provider value={mockContextValue}>
      {children}
    </WeatherContext.Provider>
  );
};

// Get unique 4-digit weather codes (first 4 digits, excluding time of day)
const getUnique4DigitCodes = (): number[] => {
  const codes = new Set<number>();
  Object.keys(WEATHER_ICON_MAP).forEach((codeStr) => {
    // Extract first 4 digits
    if (codeStr.length >= 4) {
      const fourDigitCode = parseInt(codeStr.substring(0, 4));
      codes.add(fourDigitCode);
    }
  });
  return Array.from(codes).sort((a, b) => a - b);
};

const unique4DigitCodes = getUnique4DigitCodes();

// Get weather code options for the control
const getWeatherCodeOptions = () => {
  const options: Record<string, number> = {};
  unique4DigitCodes.forEach((fourDigitCode) => {

    const codeStr = fourDigitCode.toString().padStart(4, '0');
    const representativeCode = `${codeStr}0`;
    
    const iconInfo = WEATHER_ICON_MAP[representativeCode];
    if (iconInfo) {
      const weatherName = iconInfo.iconFileName
        .replace('_large@2x.png', '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      // Store the 4-digit code as the value
      options[`${weatherName} (${codeStr})`] = fourDigitCode;
    }
  });
  return options;
};

const weatherCodeOptions = getWeatherCodeOptions();

// Helper function to create mock weather data
const createMockWeatherData = (
  weatherCode: number,
  temperature: number,
  latitude: number = 40.7128,
  longitude: number = -74.0060
): WeatherData => ({
  data: {
    time: new Date().toISOString(),
    values: {
      altimeterSetting: 1013.25,
      cloudBase: 1000,
      cloudCeiling: 2000,
      cloudCover: 50,
      dewPoint: temperature - 5,
      freezingRainIntensity: 0,
      humidity: 60,
      precipitationProbability: 20,
      pressureSeaLevel: 1013.25,
      pressureSurfaceLevel: 1013.25,
      rainIntensity: 0,
      sleetIntensity: 0,
      snowIntensity: 0,
      temperature,
      temperatureApparent: temperature + 1,
      uvHealthConcern: 2,
      uvIndex: 5,
      visibility: 10000,
      weatherCode,
      windDirection: 180,
      windGust: 10,
      windSpeed: 5,
    },
  },
  location: {
    lat: latitude,
    lon: longitude,
  },
});

// Helper function to create mock city
const createMockCity = (cityName: string = 'New York', latitude: number = 40.7128, longitude: number = -74.0060): City => ({
  city: cityName,
  latitude,
  longitude,
});

const meta: Meta<typeof AppContent> = {
  title: 'App/AppContent',
  component: AppContent,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <Story />
        </SettingsProvider>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AppContent>;

// Single story with controls for all weather conditions
export const Default: Story = {
  args: {
    weatherCode: 1000,
    timeOfDay: 'day',
    cityName: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    temperature: 22,
  },
  argTypes: {
    weatherCode: {
      control: 'select',
      options: weatherCodeOptions,
      description: 'Weather condition code',
    },
    timeOfDay: {
      control: 'select',
      options: {
        Night: 'night',
        Sunrise: 'sunrise',
        Day: 'day',
        Sunset: 'sunset',
      },
      description: 'Time of day for the background gradient',
    },
    cityName: {
      control: 'text',
      description: 'City name to display',
    },
    latitude: {
      control: { type: 'number', min: -90, max: 90, step: 0.1 },
      description: 'Latitude coordinate',
    },
    longitude: {
      control: { type: 'number', min: -180, max: 180, step: 0.1 },
      description: 'Longitude coordinate',
    },
    temperature: {
      control: { type: 'number', min: -50, max: 50, step: 1 },
      description: 'Temperature in Celsius',
    },
  },
  render: (args) => {
    const { weatherCode, timeOfDay, cityName, latitude, longitude, temperature } = args as {
      weatherCode: number;
      timeOfDay: TimeOfDay;
      cityName: string;
      latitude: number;
      longitude: number;
      temperature: number;
    };

    return (
      <MockWeatherProvider
        weatherData={createMockWeatherData(weatherCode, temperature, latitude, longitude)}
        timeOfDay={timeOfDay}
        city={createMockCity(cityName, latitude, longitude)}
      >
        <AppContent />
      </MockWeatherProvider>
    );
  },
};
