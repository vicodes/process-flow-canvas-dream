
import { ProcessInstance } from '@/context/AppContext';
import { getEnvironment } from '../config/environments';

// Mock API service
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Processes
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
      status: instance.status,
      startDate: instance.createdAt,
      endDate: instance.createdAt,
      bpmnXML: instance.bpmnXML,
      variables: instance.variables,
      sequenceExecutions: instance.sequenceExecutions,
    };
  },
  
  // BPMN diagrams
  getProcessXml: async (processId: string) => {
    const url = `${getEnvironment().apiUrl}/api/processDefinition/${processId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/xml',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch process XML: ${response.statusText}`);
    }
    return response.text();
  },
  
  // Task history for a process instance
  getInstanceTaskHistory: (instanceId: string) => {
    const taskCount = Math.floor(Math.random() * 5) + 2; // 2-6 tasks
    const history = [];
    
    const instance = processInstances.find(i => i.id === instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }
    
    const startDate = new Date(instance.startDate);
    
    for (let i = 0; i < taskCount; i++) {
      const taskDate = new Date(startDate);
      taskDate.setMinutes(taskDate.getMinutes() + (i * 30)); // 30 min between tasks
      
      let status: 'completed' | 'active' | 'pending' | 'failed' = 'completed';
      
      // If this is the active instance with some progress
      if (instance.status === 'active' && i === taskCount - 1) {
        status = 'active';
      } else if (instance.status === 'failed' && i === taskCount - 1) {
        status = 'failed';
      } else if (i >= taskCount - 1 && instance.status === 'pending') {
        status = 'pending';
      }
      
      history.push({
        taskId: `task-${i + 1}`,
        taskName: ['Review Order', 'Process Payment', 'Prepare Package', 'Select Carrier', 'Update Tracking', 'Complete Order'][i % 6],
        status,
        timestamp: taskDate.toISOString(),
        assignee: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'][Math.floor(Math.random() * 4)]
      });
    }
    
    return history;
  },
  
  // Export to CSV
  exportToCSV: async (data: any[]): Promise<string> => {
    await delay(300);
    
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
