'use client';

import React from 'react';

import Tag from './Tag';

interface TagListProps {
  tags: string[];
  onDeleteTag: (tag: string) => void;
}

export default function TagList({ tags, onDeleteTag }: TagListProps) {
  return (
    <ul role="list" className="flex flex-wrap gap-2 bg-gray-700 p-2 rounded-md">
      {tags.map((tag, i) => (
        <li key={i}>
          <Tag key={tag} onDelete={() => onDeleteTag(tag)}>
            {tag}
          </Tag>
        </li>
      ))}
    </ul>
  );
}
