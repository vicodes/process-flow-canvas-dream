
import { ProcessInstance } from '@/context/AppContext';
import { getEnvironment } from '../config/environments';

// Dummy data for process instances
const dummyProcessInstances: ProcessInstance[] = [
  {
    processId: 'PI-001',
    processName: 'Customer Onboarding',
    processVersion: '1.0',
    status: 'COMPLETED',
    startDate: '2025-05-02T09:15:00.000Z',
    endDate: '2025-05-02T10:45:00.000Z',
  },
  {
    processId: 'PI-002',
    processName: 'Invoice Processing',
    processVersion: '2.1',
    status: 'RUNNING',
    startDate: '2025-05-05T14:30:00.000Z',
    endDate: null,
  },
  {
    processId: 'PI-003',
    processName: 'Expense Approval',
    processVersion: '1.2',
    status: 'HOLD',
    startDate: '2025-05-04T11:20:00.000Z',
    endDate: null,
  },
  {
    processId: 'PI-004',
    processName: 'Document Review',
    processVersion: '3.0',
    status: 'INCIDENT',
    startDate: '2025-05-03T16:00:00.000Z',
    endDate: null,
  },
  {
    processId: 'PI-005',
    processName: 'Customer Onboarding',
    processVersion: '1.0',
    status: 'RUNNING',
    startDate: '2025-05-06T08:45:00.000Z',
    endDate: null,
  },
  {
    processId: 'PI-006',
    processName: 'Invoice Processing',
    processVersion: '2.1',
    status: 'COMPLETED',
    startDate: '2025-05-01T13:10:00.000Z',
    endDate: '2025-05-01T14:20:00.000Z',
  },
  {
    processId: 'PI-007',
    processName: 'Document Review',
    processVersion: '3.0',
    status: 'RUNNING',
    startDate: '2025-05-06T10:30:00.000Z',
    endDate: null,
  },
  {
    processId: 'PI-008',
    processName: 'Expense Approval',
    processVersion: '1.2',
    status: 'COMPLETED',
    startDate: '2025-04-29T09:00:00.000Z',
    endDate: '2025-04-29T11:15:00.000Z',
  },
  {
    processId: 'PI-009',
    processName: 'Customer Onboarding',
    processVersion: '1.0',
    status: 'HOLD',
    startDate: '2025-05-05T15:45:00.000Z',
    endDate: null,
  },
  {
    processId: 'PI-010',
    processName: 'Invoice Processing',
    processVersion: '2.1',
    status: 'RUNNING',
    startDate: '2025-05-07T08:30:00.000Z',
    endDate: null,
  },
];

// Dummy BPMN XML data
const dummyBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0r7z5ee" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.6.0">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Review Request">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:exclusiveGateway id="Gateway_1" name="Approved?">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Gateway_1" />
    <bpmn:task id="Task_2" name="Process Request">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_3" name="Yes" sourceRef="Gateway_1" targetRef="Task_2" />
    <bpmn:task id="Task_3" name="Notify Rejection">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_4" name="No" sourceRef="Gateway_1" targetRef="Task_3" />
    <bpmn:endEvent id="EndEvent_1" name="End Success">
      <bpmn:incoming>Flow_5</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_2" targetRef="EndEvent_1" />
    <bpmn:endEvent id="EndEvent_2" name="End Rejected">
      <bpmn:incoming>Flow_6</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Task_3" targetRef="EndEvent_2" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="145" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1" bpmnElement="Task_1">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Gateway_1" bpmnElement="Gateway_1" isMarkerVisible="true">
        <dc:Bounds x="395" y="95" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="393" y="65" width="54" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_2" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="395" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Activity_2" bpmnElement="Task_2">
        <dc:Bounds x="500" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_3" bpmnElement="Flow_3">
        <di:waypoint x="445" y="120" />
        <di:waypoint x="500" y="120" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="464" y="102" width="18" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Activity_3" bpmnElement="Task_3">
        <dc:Bounds x="500" y="190" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_4" bpmnElement="Flow_4">
        <di:waypoint x="420" y="145" />
        <di:waypoint x="420" y="230" />
        <di:waypoint x="500" y="230" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="428" y="185" width="15" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_1" bpmnElement="EndEvent_1">
        <dc:Bounds x="652" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="638" y="145" width="64" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_5" bpmnElement="Flow_5">
        <di:waypoint x="600" y="120" />
        <di:waypoint x="652" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_2" bpmnElement="EndEvent_2">
        <dc:Bounds x="652" y="212" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="636" y="255" width="68" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_6" bpmnElement="Flow_6">
        <di:waypoint x="600" y="230" />
        <di:waypoint x="652" y="230" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

// Dummy process definitions
const dummyProcesses = [
  { id: 'proc-1', name: 'Customer Onboarding', version: '1.0' },
  { id: 'proc-2', name: 'Invoice Processing', version: '2.1' },
  { id: 'proc-3', name: 'Expense Approval', version: '1.2' },
  { id: 'proc-4', name: 'Document Review', version: '3.0' },
];

// Dummy process variables
const dummyVariables = {
  customerId: "CUST-12345",
  requestDate: "2025-05-01T10:30:00Z",
  approved: true,
  totalAmount: 1250.75,
  items: [
    { id: "ITEM-001", name: "Product A", quantity: 2, price: 125.50 },
    { id: "ITEM-002", name: "Product B", quantity: 1, price: 999.75 }
  ],
  notes: "Priority customer, expedite processing",
  department: "Sales",
  priority: "HIGH",
  approver: "jsmith@example.com"
};

// Dummy sequence executions
const dummySequenceExecutions = {
  "StartEvent_1": {
    nodeInformation: { name: "Start Process", scopeId: "scope-001" },
    state: "COMPLETED"
  },
  "Task_1": {
    nodeInformation: { name: "Review Request", scopeId: "scope-001" },
    state: "COMPLETED"
  },
  "Gateway_1": {
    nodeInformation: { name: "Decision Point", scopeId: "scope-001" },
    state: "COMPLETED"
  },
  "Task_2": {
    nodeInformation: { name: "Process Request", scopeId: "scope-001" },
    state: "RUNNING"
  }
};

export const api = {
  getProcesses: async () => {
    // Return dummy process definitions
    return dummyProcesses;
  },
  
  // Process instances
  getProcessInstances: async (filters?: {
    processId?: string;
    version?: string;
    searchText?: string;
  }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredInstances = [...dummyProcessInstances];

    if (filters) {
      if (filters.processId) {
        filteredInstances = filteredInstances.filter(instance =>
          instance.processName === filters.processId
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
          instance.processName.toLowerCase().includes(searchLower) ||
          instance.processId.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredInstances;
  },
  
  getProcessInstance: async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Find the instance with the matching ID
    const instance = dummyProcessInstances.find(inst => inst.processId === id);

    if (!instance) {
      throw new Error(`Process instance with ID ${id} not found`);
    }
    
    return {
      ...instance,
      bpmnXML: dummyBpmnXml,
      variables: dummyVariables,
      sequenceExecutions: dummySequenceExecutions,
    };
  },
  
  // Export to CSV - Fix the type to ensure it returns a string
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
