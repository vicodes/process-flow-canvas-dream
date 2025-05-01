
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Process {
  id: string;
  name: string;
  description: string;
  version: string;
}

export interface ProcessInstance {
  processId: string;
  processName: string;
  processVersion: string;
  status: string,
  startDate: string;
  endDate: string | null;
}

interface AppContextType {
  filters: {
    process: string | null;
    version: string | null;
    searchText: string;
  };
  setFilters: (filters: { process?: string | null; version?: string | null; searchText?: string }) => void;
  clearFilters: () => void;
  activeInstanceId: string | null;
  setActiveInstanceId: (id: string | null) => void;
  savedDiagrams: Record<string, string>;
  saveDiagram: (id: string, xml: string) => void;
  removeDiagram: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFiltersState] = useState<AppContextType['filters']>({
    process: null,
    version: null,
    searchText: '',
  });
  
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);
  const [savedDiagrams, setSavedDiagrams] = useState<Record<string, string>>({});

  const setFilters = (newFilters: { process?: string | null; version?: string | null; searchText?: string }) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
    }));
  };

  const clearFilters = () => {
    setFiltersState({
      process: null,
      version: null,
      searchText: '',
    });
  };

  const saveDiagram = (id: string, xml: string) => {
    setSavedDiagrams(prev => ({
      ...prev,
      [id]: xml,
    }));
  };

  const removeDiagram = (id: string) => {
    setSavedDiagrams(prev => {
      const newDiagrams = { ...prev };
      delete newDiagrams[id];
      return newDiagrams;
    });
  };

  return (
    <AppContext.Provider
      value={{
        filters,
        setFilters,
        clearFilters,
        activeInstanceId,
        setActiveInstanceId,
        savedDiagrams,
        saveDiagram,
        removeDiagram,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
