
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, RefreshCw, Copy, Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!variables.length) {
    return <p className="text-gray-500 text-center py-4">No process variables found</p>;
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
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {filteredVariables.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No variables match your search</p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {filteredVariables.map((variable) => {
            const isExpanded = expandedVariables[variable.name];
            const isHidden = hideValues[variable.name];
            const isJsonType = variable.type === 'Json';
            
            return (
              <div key={variable.name} className="border border-gray-200 rounded-md">
                <div 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-t-md cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleExpand(variable.name)}
                >
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="font-medium">{variable.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {variable.type}
                    </Badge>
                    {variable.scope && (
                      <Badge variant="secondary" className="text-xs">
                        {variable.scope}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
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
                </div>
                
                {isExpanded && (
                  <div className="p-3 border-t border-gray-200 bg-white rounded-b-md">
                    {isHidden ? (
                      <div className="px-3 py-2 bg-gray-100 text-gray-400 text-center rounded">
                        ••••••••••••
                      </div>
                    ) : isJsonType ? (
                      <pre className="bg-gray-50 p-2 rounded overflow-x-auto text-xs">
                        {formatValue(variable.value, variable.type)}
                      </pre>
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded overflow-x-auto break-all">
                        {variable.value}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProcessVariables;
