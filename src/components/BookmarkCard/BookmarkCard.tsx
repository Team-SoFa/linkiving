'use client';

import React from 'react';

import Image from '../../../public/icons/Image';

interface BookmarkCardProps {
  imageUrl?: string;
  title: string;
  summary: string;
  link: string;
  onClick?: () => void;
}
export default function BookmarkCard({
  title = '',
  summary = '',
  link = '',
  onClick,
}: BookmarkCardProps) {
  const baseStyle = 'flex flex-col w-60 h-60 rounded-lg overflow-hidden hover:cursor-pointer';
  const imageAreaStyle =
    'flex flex-shrink-0 justify-center items-center  bg-gray-400 w-full h-[50%]';
  const infoAreaStyle = 'flex flex-col gap-1 px-4 py-3 bg-gray-200 w-full h-[50%]';

  const titleStyle = 'flex-col text-lg font-semibold text-gray-800';
  const linkStyle = 'inline-block max-w-fit text-[12px] text-blue-500 hover:underline';
  const summaryStyle = 'text-[12px] text-gray-600 font-normal';

  return (
    <div className={baseStyle} onClick={onClick}>
      <div className={imageAreaStyle}>
        <Image src="file.svg" alt="image" />
      </div>
      <div className={infoAreaStyle}>
        <span className={titleStyle}>{title}</span>
        <a className={linkStyle} href={link} target="_blank">
          {link}
        </a>
        <span className={summaryStyle}>{summary}</span>
      </div>
    </div>
  );
}
