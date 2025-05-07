
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
import { useAuth } from '@/context/AuthContext';

export const UserDropdown: React.FC<{ collapsed?: boolean }> = ({ collapsed = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();

  // Check for user preference and system preference on mount
  useEffect(() => {
    // First check localStorage
    const storedTheme = localStorage.getItem('theme');
    
    // Then check system preference if no stored theme
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const displayName = user?.name || user?.username || 'User';
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Get profile picture from the user object (if available)
  const profilePicture = '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "flex items-center space-x-2 px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none w-full",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={profilePicture || "/placeholder.svg"} />
          <AvatarFallback className="bg-primary-100 text-primary-900 dark:bg-primary-900/20 dark:text-primary-300">{initials}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{displayName}</div>
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="top" className="w-56">
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
        
        <DropdownMenuItem 
          className="cursor-pointer text-primary-900 focus:text-primary-900 dark:text-primary-300 dark:hover:text-primary-200 dark:hover:bg-gray-700" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function cn(...classes: any[]): string {
  return classes.filter(Boolean).join(' ');
}

export default UserDropdown;
