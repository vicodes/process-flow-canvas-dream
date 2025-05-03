
import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';
import ProcessFilters, { ProcessFilters as FiltersType } from '@/components/filters/ProcessFilters';
import ProcessVersionFilters from '@/components/filters/ProcessVersionFilters';
import ProcessInstanceTable from '@/components/instances/ProcessInstanceTable';
import { Button } from '@/components/ui/button';
import { ProcessInstance } from '@/context/AppContext';
import api from '@/services/apiService';
import { DateRange } from 'react-day-picker';

const ProcessList: React.FC = () => {
  const { filters, setFilters } = useApp();
  const [instances, setInstances] = useState<ProcessInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [localFilters, setLocalFilters] = useState<FiltersType>({
    search: "",
    status: "",
    dateRange: undefined
  });
  
  // Handle process and version filter changes
  const handleVersionFiltersChange = (versionFilters: { process: string; version: string }) => {
    setFilters({
      ...filters,
      process: versionFilters.process,
      version: versionFilters.version
    });
  };
  
  // Fetch process instances
  useEffect(() => {
    const fetchInstances = async () => {
      setLoading(true);
      
      try {
        const data = await api.getProcessInstances({
          processId: filters.process ? 
            // Find the processId that matches the process name
            (await api.getProcesses()).find(p => p.name === filters.process)?.id : 
            undefined,
          version: filters.version,
          searchText: filters.searchText,
        });
        
        let filteredData = [...data];
        
        // Apply additional filters (from ProcessFilters component)
        if (localFilters.search) {
          filteredData = filteredData.filter(instance => 
            instance.processName.toLowerCase().includes(localFilters.search.toLowerCase()) ||
            instance.processId.toLowerCase().includes(localFilters.search.toLowerCase())
          );
        }
        
        if (localFilters.status && localFilters.status !== 'all') {
          filteredData = filteredData.filter(instance => 
            instance.status.toLowerCase() === localFilters.status.toLowerCase()
          );
        }
        
        if (localFilters.dateRange && localFilters.dateRange.from) {
          const fromDate = new Date(localFilters.dateRange.from);
          filteredData = filteredData.filter(instance => {
            const instanceDate = new Date(instance.startDate);
            return instanceDate >= fromDate;
          });
          
          if (localFilters.dateRange.to) {
            const toDate = new Date(localFilters.dateRange.to);
            filteredData = filteredData.filter(instance => {
              const instanceDate = new Date(instance.startDate);
              return instanceDate <= toDate;
            });
          }
        }
        
        setInstances(filteredData);
      } catch (error) {
        console.error('Error fetching process instances:', error);
        toast.error('Failed to load process instances');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstances();
  }, [filters, localFilters]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: FiltersType) => {
    setLocalFilters(newFilters);
  };
  
  // Export instances to CSV
  const handleExportCSV = async () => {
    try {
      // Prepare data for export
      const exportData = instances.map(instance => ({
        ID: instance.processId,
        ProcessName: instance.processName,
        Version: instance.processVersion,
        Status: instance.status,
        StartDate: instance.startDate,
        EndDate: instance.endDate || ''
      }));
      
      // Generate CSV with proper type
      const csvContent = await api.exportToCSV(exportData);
      
      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `process-instances-${new Date().toISOString().slice(0, 10)}.csv`);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Export successful');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export data');
    }
  };
  
  // Get summary counts
  const getInstancesCount = () => {
    const active = instances.filter(i => i.status === 'RUNNING').length;
    const completed = instances.filter(i => i.status === 'COMPLETED').length;
    
    return { total: instances.length, active, completed };
  };
  
  const counts = getInstancesCount();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Process Instances</h1>
        
        <Button 
          variant="outline" 
          onClick={handleExportCSV}
          disabled={loading || instances.length === 0}
          className="btn-hover-glow"
        >
          <Download className="mr-1 w-4 h-4" />
          Export CSV
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass p-4 rounded-lg animate-fade-in">
          <div className="text-primary-700 text-2xl font-bold">{counts.total}</div>
          <div className="text-gray-500">Total Instances</div>
        </div>
        
        <div className="glass p-4 rounded-lg animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="text-success text-2xl font-bold">{counts.active}</div>
          <div className="text-gray-500">Active Instances</div>
        </div>
        
        <div className="glass p-4 rounded-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="text-primary-700 text-2xl font-bold">{counts.completed}</div>
          <div className="text-gray-500">Completed Instances</div>
        </div>
      </div>
      
      {/* Process and Version filters */}
      <ProcessVersionFilters onFiltersChange={handleVersionFiltersChange} />
      
      {/* Additional filters */}
      <ProcessFilters 
        onFilterChange={handleFilterChange} 
        onExport={handleExportCSV} 
      />
      
      <ProcessInstanceTable instances={instances} loading={loading} />
    </div>
  );
};

export default ProcessList;
