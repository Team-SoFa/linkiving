'use client';

import React from 'react';

import TagList from './TagList';

export default function TagManager() {
  const [tags, setTags] = React.useState<string[]>(['html', 'css', '개발']); // 예시 리스트

  const handleDeleteTag = (deleteTag: string) => {
    setTags(prev => prev.filter(tag => tag !== deleteTag));
  };

  return (
    <div>
      <TagList tags={tags} onDeleteTag={handleDeleteTag} />
    </div>
  );
}
