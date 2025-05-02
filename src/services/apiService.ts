
import { ProcessInstance } from '@/context/AppContext';
import { getEnvironment } from '../config/environments';

export const api = {
  getProcesses: async () => {
    const url = `${getEnvironment().apiUrl}/api/processDefinitions`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch processesInstances: ${response.statusText}`);
    }
    return response.json();
  },
  
  // Process instances
  getProcessInstances: async (filters?: {
    processId?: string;
    version?: string;
    searchText?: string;
  }) => {
    const instances: ProcessInstance[] = [];
    const url = `${getEnvironment().apiUrl}/api/processInstances`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch processesInstances: ${response.statusText}`);
    }
    const pagedResponse = await response.json();
    const pi = pagedResponse.content;
    pi.forEach((process) => {
      instances.push({
        processId: process.processInstanceId,
        processName: process.processDefinitionId,
        processVersion: process.version,
        status: process.state,
        startDate: process.createdAt,
        endDate: process.createdAt
      });
    })

    let filteredInstances = [...instances];

    if (filters) {
      if (filters.processId) {
        filteredInstances = filteredInstances.filter(instance =>
          instance.processId === filters.processId
        );
      }

      if (filters.version) {
        filteredInstances = filteredInstances.filter(instance =>
          instance.processVersion === filters.version
        );
      }

      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filteredInstances = filteredInstances.filter(instance =>
          // instance.id.toLowerCase().includes(searchLower) ||
          instance.processName.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredInstances;
  },
  
  getProcessInstance: async (id: string) => {
    const url = `${getEnvironment().apiUrl}/api/processInstance/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch processesInstances: ${response.statusText}`);
    }
    const instance = await response.json();

    if (!instance) {
      throw new Error(`Process instance with ID ${id} not found`);
    }
    
    return {
      processId: instance.processInstanceId,
      processName: instance.processDefinitionId,
      processVersion: instance.version,
      status: instance.state,
      startDate: instance.createdAt,
      endDate: instance.createdAt,
      bpmnXML: instance.bpmnXML,
      variables: instance.variables,
      sequenceExecutions: instance.sequenceExecutions,
    };
  },
  
  // Export to CSV
  exportToCSV: async <T extends Record<string, any>>(data: T[]): Promise<string> => {
    if (!data || data.length === 0) {
      return '';
    }
    
    // Extract headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // Headers row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values with commas
          if (value === null || value === undefined) {
            return '';
          }
          const stringValue = String(value);
          return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  },
};

export default api;
