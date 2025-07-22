import Dropdown, { DropdownOption } from '@/components/basics/Dropdown/Dropdown';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { type ComponentProps, useState } from 'react';

const options: DropdownOption[] = [
  { value: 'apple', label: '🍎 Apple' },
  { value: 'banana', label: '🍌 Banaaaana' },
  { value: 'cherry', label: '🍒 Cherry' },
  { value: 'grape', label: '🍇 Grape' },
  { value: 'watermelon', label: '🍉 Watermelon' },
  { value: 'peach', label: '🍑 Peach' },
];

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    onSelect: {
      action: 'option selected',
      description: '선택된 옵션을 처리하는 콜백 함수',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof Dropdown>;

function InteractiveDropdown(args: ComponentProps<typeof Dropdown>) {
  const [selected, setSelected] = useState<DropdownOption>(args.defaultSelected ?? options[0]);
  return (
    <Dropdown
      {...args}
      defaultSelected={selected}
      onSelect={option => {
        setSelected(option);
        args.onSelect?.(option);
      }}
    />
  );
}

// 인터랙티브 스토리 (render 있음)
export const Default: Story = {
  render: args => <InteractiveDropdown {...args} />,
  args: {
    options,
    defaultSelected: options[0],
    size: 'sm',
    color: 'blue',
  },
};
