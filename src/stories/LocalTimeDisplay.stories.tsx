import type { Meta, StoryObj } from '@storybook/react';
import LocalTimeDisplay from '../components/LocalTimeDisplay';
import type { City } from '../types/weather';

const meta: Meta<typeof LocalTimeDisplay> = {
  title: 'Components/LocalTimeDisplay',
  component: LocalTimeDisplay,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    city: {
      control: 'object',
      description: 'City object with timezone for displaying local time',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<{ city: City | null; className?: string }>;

export const Default: Story = {
  args: {
    city: {
      name: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
    },
    className: '',
  },
  render: ({ city, className }) => (
    <div className="p-6 rounded-lg bg-time-bg/30 backdrop-blur-md border border-time-text/30">
      <LocalTimeDisplay city={city} className={className} />
    </div>
  ),
};
