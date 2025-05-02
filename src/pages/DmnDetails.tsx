
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock DMN decision data
const mockDmnData = {
  "dmn-001": {
    id: "dmn-001",
    name: "Credit Score Decision",
    version: "1.0",
    status: "Active",
    startDate: "2025-04-20",
    endDate: "2025-05-01",
    inputVariables: [
      { name: "creditScore", value: "720", type: "number" },
      { name: "income", value: "75000", type: "number" },
      { name: "loanAmount", value: "250000", type: "number" },
      { name: "customerAge", value: "35", type: "number" },
    ],
    outputVariables: [
      { name: "approved", value: "true", type: "boolean" },
      { name: "interestRate", value: "4.5", type: "number" },
      { name: "riskCategory", value: "LOW", type: "string" },
    ],
    executionHistory: [
      { timestamp: "2025-04-20T10:15:30", activity: "DMN Started", performer: "System", details: "Decision evaluation initiated" },
      { timestamp: "2025-04-20T10:15:31", activity: "Input Validation", performer: "System", details: "All inputs validated successfully" },
      { timestamp: "2025-04-20T10:15:32", activity: "Rule Evaluation", performer: "System", details: "Applied credit score rules" },
      { timestamp: "2025-04-20T10:15:33", activity: "Decision Output", performer: "System", details: "Decision output generated: Approved with 4.5% interest rate" },
    ]
  },
  "dmn-002": {
    id: "dmn-002",
    name: "Loan Approval Matrix",
    version: "2.1",
    status: "Active",
    startDate: "2025-04-15",
    endDate: "2025-04-30",
    inputVariables: [
      { name: "creditScore", value: "680", type: "number" },
      { name: "debtToIncomeRatio", value: "0.32", type: "number" },
      { name: "loanAmount", value: "350000", type: "number" },
    ],
    outputVariables: [
      { name: "approved", value: "true", type: "boolean" },
      { name: "requiredDownPayment", value: "70000", type: "number" },
      { name: "loanTerm", value: "30", type: "number" },
    ],
    executionHistory: [
      { timestamp: "2025-04-15T14:20:10", activity: "DMN Started", performer: "System", details: "Loan approval evaluation initiated" },
      { timestamp: "2025-04-15T14:20:12", activity: "Risk Assessment", performer: "System", details: "Medium risk profile identified" },
      { timestamp: "2025-04-15T14:20:14", activity: "Terms Calculation", performer: "System", details: "Loan terms calculated based on risk profile" },
    ]
  },
  // More DMN instances would be here
};

const DmnDetails: React.FC = () => {
  const { dmnId } = useParams<{ dmnId: string }>();
  const [activeTab, setActiveTab] = useState('summary');
  
  // Get DMN data using dmnId or use a default/error state if not found
  const dmnData = dmnId && mockDmnData[dmnId] ? mockDmnData[dmnId] : null;
  
  if (!dmnData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">DMN Instance Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">The requested DMN instance does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dmnData.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID: {dmnData.id} • Version: {dmnData.version} • 
            <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              dmnData.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
              dmnData.status === "Failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
              "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            }`}>
              {dmnData.status}
            </span>
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>DMN Decision Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">DMN Information</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium text-gray-500 dark:text-gray-400">ID:</div>
                        <div className="col-span-2">{dmnData.id}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium text-gray-500 dark:text-gray-400">Name:</div>
                        <div className="col-span-2">{dmnData.name}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium text-gray-500 dark:text-gray-400">Version:</div>
                        <div className="col-span-2">{dmnData.version}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium text-gray-500 dark:text-gray-400">Status:</div>
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            dmnData.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                            dmnData.status === "Failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}>
                            {dmnData.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Timeline</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium text-gray-500 dark:text-gray-400">Start Date:</div>
                        <div className="col-span-2">{dmnData.startDate}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium text-gray-500 dark:text-gray-400">End Date:</div>
                        <div className="col-span-2">{dmnData.endDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="variables">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dmnData.inputVariables.map((variable, index) => (
                        <TableRow key={index}>
                          <TableCell>{variable.name}</TableCell>
                          <TableCell>{variable.value}</TableCell>
                          <TableCell>{variable.type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Output Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dmnData.outputVariables.map((variable, index) => (
                        <TableRow key={index}>
                          <TableCell>{variable.name}</TableCell>
                          <TableCell>{variable.value}</TableCell>
                          <TableCell>{variable.type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Performer</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dmnData.executionHistory.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.timestamp}</TableCell>
                        <TableCell>{entry.activity}</TableCell>
                        <TableCell>{entry.performer}</TableCell>
                        <TableCell>{entry.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DmnDetails;
