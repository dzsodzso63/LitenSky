import { useEffect, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClientProvider } from '@tanstack/react-query';
import CitySearch from '../components/CitySearch';
import { MockWeatherProvider, createQueryClient } from './storyHelpers';

type MapboxFeature = {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    mapbox_id: string;
    feature_type: string;
    full_address: string;
    name: string;
    name_preferred: string;
    coordinates: {
      longitude: number;
      latitude: number;
    };
    place_formatted?: string;
  };
};

const meta: Meta<typeof CitySearch> = {
  title: 'Components/CitySearch',
  component: CitySearch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    results: {
      control: 'object',
      description: 'Mock Mapbox search results returned by fetch',
    },
  },
};

export default meta;

type Story = StoryObj<{ results: MapboxFeature[] }>;

const MockFetch = ({ results, children }: { results: MapboxFeature[]; children: React.ReactNode }) => {
  useEffect(() => {
    const originalFetch = global.fetch;
    global.fetch = async () =>
    ({
      json: async () => ({
        type: 'FeatureCollection',
        features: results,
      }),
    } as any);

    return () => {
      global.fetch = originalFetch;
    };
  }, [results]);

  return <>{children}</>;
};

const log = (name: string) => (...args: unknown[]) => {
  // eslint-disable-next-line no-console
  console.log(name, ...args);
};

const Template = ({ results }: { results: MapboxFeature[] }) => {
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <MockWeatherProvider setCity={log('setCity')}>
        <div className="p-8 bg-time-bg/40 backdrop-blur-md rounded-xl border border-time-text/30">
          <MockFetch results={results}>
            <CitySearch />
          </MockFetch>
          <p className="text-xs text-time-text/70 mt-3">
            Type in the input to see mocked Mapbox results.
          </p>
        </div>
      </MockWeatherProvider>
    </QueryClientProvider>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    results: [
      {
        type: 'Feature',
        id: 'nyc',
        geometry: { type: 'Point', coordinates: [-74.006, 40.7128] },
        properties: {
          mapbox_id: 'nyc',
          feature_type: 'place',
          full_address: 'New York, New York, United States',
          name: 'New York',
          name_preferred: 'New York',
          coordinates: { longitude: -74.006, latitude: 40.7128 },
          place_formatted: 'New York, NY, USA',
        },
      },
      {
        type: 'Feature',
        id: 'london',
        geometry: { type: 'Point', coordinates: [-0.1276, 51.5072] },
        properties: {
          mapbox_id: 'london',
          feature_type: 'place',
          full_address: 'London, England, United Kingdom',
          name: 'London',
          name_preferred: 'London',
          coordinates: { longitude: -0.1276, latitude: 51.5072 },
          place_formatted: 'London, UK',
        },
      },
      {
        type: 'Feature',
        id: 'tokyo',
        geometry: { type: 'Point', coordinates: [139.6917, 35.6895] },
        properties: {
          mapbox_id: 'tokyo',
          feature_type: 'place',
          full_address: 'Tokyo, Japan',
          name: 'Tokyo',
          name_preferred: 'Tokyo',
          coordinates: { longitude: 139.6917, latitude: 35.6895 },
          place_formatted: 'Tokyo, Japan',
        },
      },
    ],
  },
};
