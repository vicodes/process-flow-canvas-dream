import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import api from '@/services/apiService';

interface ProcessDefinition {
  id: string;
  name: string;
  version: string;
}

const ProcessFilters: React.FC = () => {
  const { filters, setFilters } = useApp();
  const [processes, setProcesses] = useState<ProcessDefinition[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [searchText, setSearchText] = useState(filters.searchText || '');
  
  // Fetch process definitions
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const data = await api.getProcesses();
        setProcesses(data);
        
        // Extract unique versions
        const uniqueVersions = Array.from(
          new Set(data.map((process: ProcessDefinition) => process.version))
        );
        setVersions(uniqueVersions);
      } catch (error) {
        console.error('Error fetching process definitions:', error);
      }
    };
    
    fetchProcesses();
  }, []);
  
  // Handle process selection
  const handleProcessChange = (value: string) => {
    setFilters({
      ...filters,
      process: value,
    });
  };
  
  // Handle version selection
  const handleVersionChange = (value: string) => {
    setFilters({
      ...filters,
      version: value,
    });
  };
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  
  // Apply search filter
  const handleSearch = () => {
    setFilters({
      ...filters,
      searchText,
    });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      process: '',
      version: '',
      searchText: '',
    });
    setSearchText('');
  };
  
  // Handle Enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 dark:bg-gray-800 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="process-filter" className="text-sm font-medium mb-1 block dark:text-gray-300">
            Process
          </Label>
          <Select value={filters.process} onValueChange={handleProcessChange}>
            <SelectTrigger id="process-filter" className="w-full">
              <SelectValue placeholder="All Processes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Processes</SelectItem>
              {processes.map((process) => (
                <SelectItem key={process.id} value={process.name}>
                  {process.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="version-filter" className="text-sm font-medium mb-1 block dark:text-gray-300">
            Version
          </Label>
          <Select value={filters.version} onValueChange={handleVersionChange}>
            <SelectTrigger id="version-filter" className="w-full">
              <SelectValue placeholder="All Versions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Versions</SelectItem>
              {versions.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="search-filter" className="text-sm font-medium mb-1 block dark:text-gray-300">
            Search
          </Label>
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                id="search-filter"
                type="text"
                placeholder="Search by process name..."
                className="pl-9"
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <Button onClick={handleSearch} variant="default">
              Search
            </Button>
            
            {(filters.process || filters.version || filters.searchText) && (
              <Button onClick={handleClearFilters} variant="outline" size="icon">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessFilters;
