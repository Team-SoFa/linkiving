'use client';

import React from 'react';

import Tag from './Tag';

interface TagListProps extends React.HTMLAttributes<HTMLUListElement> {
  tags: string[];
  onDeleteTag: (tag: string) => void;
}

const TagList = React.forwardRef<HTMLUListElement, TagListProps>(function TagList(
  { tags, onDeleteTag },
  ref
) {
  return (
    <ul ref={ref} role="list" className="flex flex-wrap gap-2 rounded-md bg-gray-700 p-2">
      {tags.map(tag => (
        <li key={tag}>
          <Tag label={tag} onDelete={() => onDeleteTag(tag)} />
        </li>
      ))}
    </ul>
  );
});

export default TagList;
