import TagList from '@/components/basics/Tag/TagList';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta = {
  title: 'Components/Basics/TagList',
  component: TagList,
  tags: ['autodocs'],
  argTypes: {
    onDeleteTag: { action: 'delete tag clicked' },
  },
} satisfies Meta<typeof TagList>;

export default meta;
type Story = StoryObj<typeof TagList>;

export const Default: Story = {
  args: {
    tags: ['React', 'TypeScript', 'Next.js'],
  },
  render: args => <TagList {...args} />,
};

function InteractiveDeleteTagList() {
  const [tags, setTags] = React.useState(['React', 'Vue', 'Angular']);
  const handleDelete = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  return <TagList tags={tags} onDeleteTag={handleDelete} />;
}

// 버튼 클릭으로 태그 삭제를 보여줌
export const InteractiveDelete: Story = {
  render: () => <InteractiveDeleteTagList />,
};
