'use client';

import React, { HTMLAttributes, forwardRef, useState } from 'react';

import AccordionButton from './AccordionButton/AccordionButton';

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  openTitle: string;
  closeTitle: string;
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ openTitle, closeTitle, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="flex flex-col gap-2" ref={ref} {...props}>
        {isOpen && <div className="font-body-md">{children}</div>}
        <AccordionButton
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          openTitle={openTitle}
          closeTitle={closeTitle}
        />
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';
export default Accordion;
