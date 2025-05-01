
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { UserDropdown } from './UserDropdown';

export const Navbar: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm h-16 sticky top-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <svg width="24" height="24" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" fill="#e20074"/>
              <path d="M22.67,35.28h-6.67v-6.6h6.67v6.6Zm-6.67-21.78v11.22h2v-.33c0-5.28,3-8.58,8.67-8.58h.33v23.76c0,3.3-1.33,4.62-4.67,4.62h-1v2.31h17.33v-2.31h-1c-3.33,0-4.67-1.32-4.67-4.62V15.81h.33c5.67,0,8.67,3.3,8.67,8.58v.33h2V13.5H16Zm21.33,21.78h6.67v-6.6h-6.67v6.6Z"
                    fill="#fff"/>
            </svg>
            <h1 className="text-xl font-bold text-primary-900 dark:text-primary-400">OrchesT</h1>
          </Link>
        </div>

        <div className="flex items-center">
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};
