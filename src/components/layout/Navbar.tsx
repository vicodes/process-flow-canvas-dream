
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserDropdown } from './UserDropdown';

export const Navbar: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm h-16 sticky top-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary-600 dark:text-primary-400" strokeWidth={2} />
            <h1 className="text-xl font-bold text-primary-700 dark:text-primary-400">OrchesT</h1>
          </Link>
        </div>

        <div className="flex items-center">
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};
