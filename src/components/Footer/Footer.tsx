import React from 'react';

const Footer = () => {
  return (
    <footer className="flex h-40 items-end justify-center bg-gray-800 p-5 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>&copy; {new Date().getFullYear()} Linkiving. All rights reserved.</p>
    </footer>
  );
};
export default Footer;
