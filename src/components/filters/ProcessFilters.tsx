import React, {useState, useEffect} from 'react';
import {Check, X, Search} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {useApp} from '@/context/AppContext';
import api from '@/services/apiService';

const ProcessFilters: React.FC = () => {
  const {filters, setFilters, clearFilters} = useApp();
  const [processes, setProcesses] = useState<{ id: string; name: string }[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch processes for filter dropdown
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const data = await api.getProcesses();
        // Extract unique processes
        const uniqueProcesses = Array.from(
            new Set(data.map(p => p.processDefinitionId))
        ).map(name => {
          const process = data.find(p => p.processDefinitionId === name);
          return {id: process?.id, name: name};
        });
        setProcesses(uniqueProcesses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching processes:', error);
        setLoading(false);
      }
    };
    fetchProcesses();
  }, []);

  // Update versions when process changes
  useEffect(() => {
    const fetchVersions = async () => {
      if (!filters.process) {
        setVersions([]);
        return;
      }

      try {
        const data = await api.getProcesses();
        // Filter versions for selected process
        const processVersions = data
            .filter(p => p.processDefinitionId === filters.process)
            .map(p => p.version);

        setVersions(processVersions);
      } catch (error) {
        console.error('Error fetching versions:', error);
      }
    };

    fetchVersions();
  }, [filters.process]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({searchText: e.target.value});
  };

  // Handle process selection
  const handleProcessChange = (value: string) => {
    setFilters({process: value, version: null});
  };

  // Handle version selection
  const handleVersionChange = (value: string) => {
    setFilters({version: value});
  };

  return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-2 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
                placeholder="Search by ID or name..."
                value={filters.searchText}
                onChange={handleSearchChange}
                className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
          </div>

          <Select
              value={filters.process || ''}
              onValueChange={handleProcessChange}
              disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Process"/>
            </SelectTrigger>
            <SelectContent>
              {processes.map(process => (
                  <SelectItem key={process.id} value={process.name}>
                    {process.name}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
              value={filters.version || ''}
              onValueChange={handleVersionChange}
              disabled={!filters.process || loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Version"/>
            </SelectTrigger>
            <SelectContent>
              {versions.map(version => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end mt-4">
          <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mr-2"
              disabled={!filters.process && !filters.version && !filters.searchText}
          >
            <X className="mr-1 h-4 w-4"/> Clear
          </Button>
          <Button size="sm" className="btn-hover-glow">
            <Search className="mr-1 h-4 w-4"/> Search
          </Button>
        </div>
      </div>
  );
};

export default ProcessFilters;
