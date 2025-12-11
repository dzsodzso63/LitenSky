import type { Meta, StoryObj } from '@storybook/react';
import SettingsButton from '../components/SettingsButton';
import { SettingsUnitProvider } from './storyHelpers';

type StoryArgs = {
  unit: 'metric' | 'imperial';
};

const meta: Meta<StoryArgs> = {
  title: 'Components/SettingsButton',
  component: SettingsButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    unit: {
      control: 'select',
      options: ['metric', 'imperial'],
      description: 'Initial unit selection',
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  args: {
    unit: 'metric',
  },
  render: ({ unit }) => (
    <SettingsUnitProvider unit={unit}>
      <div className="p-4 bg-time-bg/30 border border-time-text/30 rounded-lg">
        <SettingsButton />
      </div>
    </SettingsUnitProvider>
  ),
};
