import SideNavigation from '@/components/layout/SideNavigation/SideNavigation';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof SideNavigation> = {
  title: 'Components/Layout/SideNavigation',
  component: SideNavigation,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SideNavigation>;

export const Default: Story = {};
