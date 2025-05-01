
import React, { useState, useEffect } from 'react';
import { Moon, Sun, LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const UserDropdown: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for user preference and system preference on mount
  useEffect(() => {
    // First check localStorage
    const storedTheme = localStorage.getItem('theme');
    
    // Then check system preference if no stored theme
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set dark mode based on stored theme or system preference
    const shouldEnableDarkMode = storedTheme === 'dark' || (!storedTheme && systemPrefersDark);
    
    setIsDarkMode(shouldEnableDarkMode);
    
    // Apply dark mode class to document
    if (shouldEnableDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    
    // Apply or remove dark mode class
    if (newDarkModeState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store preference
    localStorage.setItem('theme', newDarkModeState ? 'dark' : 'light');
    
    // Show feedback to user
    toast.success(`${newDarkModeState ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleLogout = () => {
    // Add logout functionality here
    console.log('User logged out');
    toast.success('You have been logged out');
    // In a real application, this would clear auth tokens, redirect to login, etc.
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">JD</AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</div>
        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="dark:text-gray-200">My Account</DropdownMenuLabel>
        
        <DropdownMenuItem className="cursor-pointer dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="dark:border-gray-700" />
        
        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
              ) : (
                <Sun className="h-4 w-4 text-gray-500" />
              )}
              <Label htmlFor="dark-mode" className="text-gray-700 dark:text-gray-300">Dark Mode</Label>
            </div>
            <Switch 
              id="dark-mode" 
              checked={isDarkMode} 
              onCheckedChange={toggleDarkMode} 
            />
          </div>
        </div>
        
        <DropdownMenuSeparator className="dark:border-gray-700" />
        
        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-gray-700" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
