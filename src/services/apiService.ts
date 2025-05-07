
import { ProcessInstance } from '@/context/AppContext';

// Sample BPMN XML for a simple process
const sampleProcessXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_1" name="Review Order">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:exclusiveGateway id="Gateway_1" name="Approved?">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="Activity_2" name="Process Payment">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Activity_3" name="Send Rejection">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="Order Completed">
      <bpmn:incoming>Flow_5</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:endEvent id="EndEvent_2" name="Order Rejected">
      <bpmn:incoming>Flow_6</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_1" targetRef="Gateway_1" />
    <bpmn:sequenceFlow id="Flow_3" name="Yes" sourceRef="Gateway_1" targetRef="Activity_2" />
    <bpmn:sequenceFlow id="Flow_4" name="No" sourceRef="Gateway_1" targetRef="Activity_3" />
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Activity_2" targetRef="EndEvent_1" />
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Activity_3" targetRef="EndEvent_2" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="155" y="145" width="30" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1_di" bpmnElement="Activity_1">
        <dc:Bounds x="240" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1" isMarkerVisible="true">
        <dc:Bounds x="395" y="95" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="394" y="65" width="55" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_2_di" bpmnElement="Activity_2">
        <dc:Bounds x="500" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_3_di" bpmnElement="Activity_3">
        <dc:Bounds x="500" y="190" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="662" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="637" y="145" width="89" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_2_di" bpmnElement="EndEvent_2">
        <dc:Bounds x="662" y="212" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="641" y="255" width="80" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="395" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="445" y="120" />
        <di:waypoint x="500" y="120" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="464" y="102" width="18" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="420" y="145" />
        <di:waypoint x="420" y="230" />
        <di:waypoint x="500" y="230" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="428" y="185" width="15" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="600" y="120" />
        <di:waypoint x="662" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
        <di:waypoint x="600" y="230" />
        <di:waypoint x="662" y="230" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

// Sample BPMN XML for shipping process
const shippingProcessXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Order Ready for Shipping">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_1" name="Prepare Package">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Activity_2" name="Select Carrier">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:task>
    <bpmn:exclusiveGateway id="Gateway_1" name="Delivery Type?">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:task id="Activity_3" name="Standard Delivery">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Activity_4" name="Express Delivery">
      <bpmn:incoming>Flow_5</bpmn:incoming>
      <bpmn:outgoing>Flow_7</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Activity_5" name="Update Tracking Info">
      <bpmn:incoming>Flow_6</bpmn:incoming>
      <bpmn:incoming>Flow_7</bpmn:incoming>
      <bpmn:outgoing>Flow_8</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="Order Shipped">
      <bpmn:incoming>Flow_8</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_1" targetRef="Activity_2" />
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Activity_2" targetRef="Gateway_1" />
    <bpmn:sequenceFlow id="Flow_4" name="Standard" sourceRef="Gateway_1" targetRef="Activity_3" />
    <bpmn:sequenceFlow id="Flow_5" name="Express" sourceRef="Gateway_1" targetRef="Activity_4" />
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Activity_3" targetRef="Activity_5" />
    <bpmn:sequenceFlow id="Flow_7" sourceRef="Activity_4" targetRef="Activity_5" />
    <bpmn:sequenceFlow id="Flow_8" sourceRef="Activity_5" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="130" y="145" width="80" height="27" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1_di" bpmnElement="Activity_1">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_2_di" bpmnElement="Activity_2">
        <dc:Bounds x="390" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1" isMarkerVisible="true">
        <dc:Bounds x="545" y="95" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="535" y="65" width="70" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_3_di" bpmnElement="Activity_3">
        <dc:Bounds x="650" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_4_di" bpmnElement="Activity_4">
        <dc:Bounds x="650" y="190" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_5_di" bpmnElement="Activity_5">
        <dc:Bounds x="810" y="140" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="972" y="162" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="952" y="205" width="76" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="390" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="490" y="120" />
        <di:waypoint x="545" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="595" y="120" />
        <di:waypoint x="650" y="120" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="603" y="102" width="44" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="570" y="145" />
        <di:waypoint x="570" y="230" />
        <di:waypoint x="650" y="230" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="603" y="213" width="40" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
        <di:waypoint x="750" y="120" />
        <di:waypoint x="780" y="120" />
        <di:waypoint x="780" y="180" />
        <di:waypoint x="810" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_7_di" bpmnElement="Flow_7">
        <di:waypoint x="750" y="230" />
        <di:waypoint x="780" y="230" />
        <di:waypoint x="780" y="180" />
        <di:waypoint x="810" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_8_di" bpmnElement="Flow_8">
        <di:waypoint x="910" y="180" />
        <di:waypoint x="972" y="180" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

// Create mock data for processes
const processes = [
  { id: 'proc-001', name: 'Order Processing', description: 'Customer order handling process', version: 'v1.0' },
  { id: 'proc-002', name: 'Order Processing', description: 'Customer order handling process with reviews', version: 'v1.1' },
  { id: 'proc-003', name: 'Shipping Management', description: 'Product shipping and logistics', version: 'v1.0' },
  { id: 'proc-004', name: 'Customer Onboarding', description: 'New customer registration and setup', version: 'v2.0' },
  { id: 'proc-005', name: 'Expense Approval', description: 'Internal expense approval workflow', version: 'v1.5' }
];

// Create mock data for process instances
const generateInstances = () => {
  const instances: ProcessInstance[] = [];
  const statuses: ProcessInstance['status'][] = ['active', 'completed', 'pending', 'failed'];
  
  // Generate at least 50 instances
  for (let i = 1; i <= 50; i++) {
    const processIndex = Math.floor(Math.random() * processes.length);
    const process = processes[processIndex];
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    let endDate = null;
    if (status === 'completed' || status === 'failed') {
      const end = new Date(startDate);
      end.setHours(end.getHours() + Math.floor(Math.random() * 24));
      endDate = end.toISOString();
    }
    
    instances.push({
      id: `inst-${i.toString().padStart(3, '0')}`,
      processId: process.id,
      processName: process.name,
      processVersion: process.version,
      status,
      startDate: startDate.toISOString(),
      endDate
    });
  }
  
  return instances;
};

const processInstances = generateInstances();

// Mock API service
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Processes
  getProcesses: async () => {
    await delay(500); // Simulate network delay
    return [...processes];
  },
  
  // Process instances
  getProcessInstances: async (filters?: { 
    processId?: string;
    version?: string;
    searchText?: string;
  }) => {
    await delay(800);
    let filteredInstances = [...processInstances];
    
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
          instance.id.toLowerCase().includes(searchLower) || 
          instance.processName.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return filteredInstances;
  },
  
  getProcessInstance: async (id: string) => {
    await delay(300);
    const instance = processInstances.find(i => i.id === id);
    
    if (!instance) {
      throw new Error(`Process instance with ID ${id} not found`);
    }
    
    return instance;
  },
  
  // BPMN diagrams
  getProcessXml: async (processId: string) => {
    await delay(600);
    // Return different XML based on process ID
    if (processId.includes('proc-003')) {
      return shippingProcessXML;
    }
    return sampleProcessXML;
  },
  
  // Task history for a process instance
  getInstanceTaskHistory: async (instanceId: string) => {
    await delay(400);
    // Generate some mock task history
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
