'use client';

import { useLocalStorage } from '@reactuses/core';
import React from 'react';

import TagList from './TagList';

const DEFAULT_TAGS = ['html', 'css', '개발'];
const STORAGE_KEY = 'linkiving.sampleTags';

const TagManager = () => {
  const [tags, setTags] = useLocalStorage<string[]>(STORAGE_KEY, DEFAULT_TAGS);

  const handleDeleteTag = React.useCallback(
    (deleteTag: string) => {
      setTags(prev => (prev ?? DEFAULT_TAGS).filter(tag => tag !== deleteTag));
    },
    [setTags]
  );

  return <TagList tags={tags ?? DEFAULT_TAGS} onDeleteTag={handleDeleteTag} />;
};

export default TagManager;
