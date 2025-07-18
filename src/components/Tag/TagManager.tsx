'use client';

import React from 'react';

import TagList from './TagList';

const TagManager = () => {
  const [tags, setTags] = React.useState<string[]>(['html', 'css', '개발']); // 예시 리스트

  // useCallback으로 메모이제이션을 하여 불필요한 재렌더 줄임
  const handleDeleteTag = React.useCallback((deleteTag: string) => {
    setTags(prev => prev.filter(tag => tag !== deleteTag));
  }, []);

  return <TagList tags={tags} onDeleteTag={handleDeleteTag} />;
};

export default TagManager;
