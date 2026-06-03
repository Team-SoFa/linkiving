'use client';

import SVGIcon from '@/components/Icons/SVGIcon';
import { useState } from 'react';

export default function FAQItem({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="w-full rounded-[20px] bg-[linear-gradient(180deg,#F5F6FA_0%,#EAEDFF_100%)] px-13 py-12">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        className="flex w-full cursor-pointer items-center justify-between text-left"
      >
        <span className="text-[20px] font-semibold md:text-[28px]">Q. {title}</span>
        <SVGIcon icon={isOpen ? 'IC_Up' : 'IC_Down'} size="2xl" />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <span className="font-body-lg block pt-6">{content}</span>
        </div>
      </div>
    </li>
  );
}
