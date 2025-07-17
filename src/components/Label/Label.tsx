'use client';

import { clsx } from 'clsx';
import React from 'react';

interface LabelProps {
  text: string;
  htmlFor?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
}

export default function Label({ text, htmlFor, size = 'md', required = false }: LabelProps) {
  const baseStyle = 'block text-gray-800 font-semibold';
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  const classes = clsx(baseStyle, sizes[size]);

  return (
    <label htmlFor={htmlFor} className={classes}>
      {required && (
        <span aria-hidden="true" className="text-red-500 ml-1">
          *{' '}
        </span>
      )}
      {text}
    </label>
  );
}
