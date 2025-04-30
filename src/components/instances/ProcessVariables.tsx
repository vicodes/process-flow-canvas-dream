
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, RefreshCw, Copy, Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProcessVariable {
  name: string;
  value: string;
  type: string;
  scope: string;
}

interface ProcessVariablesProps {
  variables: ProcessVariable[];
  isLoading: boolean;
}

const ProcessVariables: React.FC<ProcessVariablesProps> = ({ variables, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedVariables, setExpandedVariables] = useState<Record<string, boolean>>({});
  const [hideValues, setHideValues] = useState<Record<string, boolean>>({});
  
  const toggleExpand = (name: string) => {
    setExpandedVariables(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  const toggleHideValue = (name: string) => {
    setHideValues(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  const copyToClipboard = (value: string, name: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Variable '${name}' copied to clipboard`);
  };
  
  const refreshVariables = () => {
    toast.info('Refreshing variables...');
    // Add actual refresh logic here
  };
  
  const filteredVariables = searchTerm 
    ? variables.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.value.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.scope.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : variables;
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  
  if (!variables.length) {
    return <p className="text-gray-500 dark:text-gray-400 text-center py-4">No process variables found</p>;
  }
  
  const formatValue = (value: string, type: string) => {
    if (type === 'Json') {
      try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return value;
      }
    }
    return value;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search variables..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={refreshVariables}
          title="Refresh variables"
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {filteredVariables.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No variables match your search</p>
      ) : (
        <div className="rounded-md border dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <TableHead className="w-[30%]">Name</TableHead>
                <TableHead className="w-[15%]">Type</TableHead>
                <TableHead className="w-[15%]">Scope</TableHead>
                <TableHead className="w-[30%]">Value</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVariables.map((variable) => {
                const isExpanded = expandedVariables[variable.name];
                const isHidden = hideValues[variable.name];
                const isJsonType = variable.type === 'Json';
                const formattedValue = formatValue(variable.value, variable.type);
                
                return (
                  <React.Fragment key={variable.name}>
                    <TableRow 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => toggleExpand(variable.name)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 mr-2 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
                          )}
                          {variable.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {variable.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {variable.scope}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[150px]">
                        {isHidden ? "••••••••••••" : variable.value}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHideValue(variable.name);
                            }}
                          >
                            {isHidden ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(variable.value, variable.name);
                            }}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {isExpanded && (
                      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            {isHidden ? (
                              <div className="px-3 py-4 bg-gray-100 dark:bg-gray-800 text-gray-400 text-center rounded">
                                ••••••••••••
                              </div>
                            ) : isJsonType ? (
                              <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto text-xs">
                                {formattedValue}
                              </pre>
                            ) : (
                              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded overflow-x-auto break-all">
                                {formattedValue}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProcessVariables;
