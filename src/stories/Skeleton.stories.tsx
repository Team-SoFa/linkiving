import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Skeleton from '../components/basics/Skeleton/Skeleton';

const meta = {
  title: 'Components/Basics/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    animated: {
      control: 'boolean',
    },
    width: {
      control: 'text',
      description: "Number(px) or CSS length (e.g., '160px', '50%', '10rem')",
    },
    height: {
      control: 'text',
      description: 'Number(px) or CSS length',
    },
    className: { control: 'text' },
    asChild: { table: { disable: true } },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Minimal Skeleton built with tailwind-variants. Controls: radius, animated, width, height.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: 'Basic',
  args: {
    width: 160,
    height: 24,
    radius: 'md',
    animated: true,
  },
  render: args => <Skeleton {...args} />,
};

export const Sizes: Story = {
  name: 'Common heights',
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Skeleton width={160} height={16} />
      <Skeleton width={160} height={24} />
      <Skeleton width={160} height={32} />
    </div>
  ),
};

export const Radius: Story = {
  name: 'Radius variants',
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Skeleton width={120} height={24} radius="none" />
      <Skeleton width={120} height={24} radius="sm" />
      <Skeleton width={120} height={24} radius="md" />
      <Skeleton width={120} height={24} radius="lg" />
      <Skeleton width={120} height={24} radius="xl" />
      <Skeleton width={48} height={48} radius="full" />
    </div>
  ),
};

export const AnimatedToggle: Story = {
  name: 'Animated on/off',
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton width={160} height={24} animated />
      <Skeleton width={160} height={24} animated={false} />
    </div>
  ),
};

export const ListExample: Story = {
  name: 'List placeholder',
  render: () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton width={40} height={40} radius="full" />
          <div className="flex-1 space-y-2">
            <Skeleton height={16} className="w-1/3" />
            <Skeleton height={14} className="w-5/6" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const CardExample: Story = {
  name: 'Card placeholder',
  render: () => (
    <div className="w-full max-w-md rounded-xl border p-4">
      <div className="mb-3 flex items-center gap-3">
        <Skeleton width={40} height={40} radius="full" />
        <div className="flex-1">
          <Skeleton height={16} className="w-1/2" />
          <Skeleton height={14} className="mt-2 w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton height={16} className="w-full" />
        <Skeleton height={16} className="w-11/12" />
        <Skeleton height={16} className="w-3/4" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton width={96} height={36} radius="lg" />
        <Skeleton width={96} height={36} radius="lg" />
      </div>
    </div>
  ),
};
