
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ValidatedSelectItem } from "@/components/ui/select-helper";
import { useApp } from '@/context/AppContext';

export type ProcessVersionFiltersProps = {
  onFiltersChange: (filters: { process: string; version: string }) => void;
};

export const ProcessVersionFilters: React.FC<ProcessVersionFiltersProps> = ({ onFiltersChange }) => {
  const { processes } = useApp();
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  
  // Get unique versions for the selected process
  const availableVersions = React.useMemo(() => {
    if (!selectedProcess) return [];
    return processes
      .filter(p => p.name === selectedProcess)
      .map(p => p.version)
      .filter((v, i, self) => self.indexOf(v) === i); // Get unique versions
  }, [processes, selectedProcess]);
  
  // Apply filters when selection changes
  useEffect(() => {
    onFiltersChange({
      process: selectedProcess,
      version: selectedVersion,
    });
  }, [selectedProcess, selectedVersion, onFiltersChange]);
  
  // Get unique process names
  const processNames = React.useMemo(() => {
    return processes
      .map(p => p.name)
      .filter((name, index, self) => self.indexOf(name) === index); // Get unique names
  }, [processes]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="w-full sm:w-1/2">
        <Select 
          value={selectedProcess} 
          onValueChange={(value) => {
            setSelectedProcess(value);
            setSelectedVersion(''); // Reset version when process changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select process" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Process</SelectLabel>
              <ValidatedSelectItem value="">All Processes</ValidatedSelectItem>
              {processNames.map((name) => (
                <ValidatedSelectItem key={name} value={name}>
                  {name}
                </ValidatedSelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-1/2">
        <Select 
          value={selectedVersion} 
          onValueChange={setSelectedVersion}
          disabled={!selectedProcess}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Version</SelectLabel>
              <ValidatedSelectItem value="">All Versions</ValidatedSelectItem>
              {availableVersions.map((version) => (
                <ValidatedSelectItem key={version} value={version}>
                  {version}
                </ValidatedSelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProcessVersionFilters;
