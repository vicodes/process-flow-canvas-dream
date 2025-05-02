
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
    ],
    dmnXml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" xmlns:di="http://www.omg.org/spec/DMN/20180521/DI/" id="definitions_0jl4qky" name="Decision" namespace="http://camunda.org/schema/1.0/dmn">
  <decision id="decision_1" name="Credit Score Decision">
    <informationRequirement id="InformationRequirement_05bz4gw">
      <requiredInput href="#InputData_0pgvdj9" />
    </informationRequirement>
    <informationRequirement id="InformationRequirement_1cxl1n8">
      <requiredInput href="#InputData_1d4tv3s" />
    </informationRequirement>
    <decisionTable id="decisionTable_1">
      <input id="input_1" label="Credit Score">
        <inputExpression id="inputExpression_1" typeRef="number">
          <text>creditScore</text>
        </inputExpression>
      </input>
      <input id="InputClause_0948tlo" label="Income">
        <inputExpression id="LiteralExpression_0l6lvdk" typeRef="number">
          <text>income</text>
        </inputExpression>
      </input>
      <output id="output_1" label="Approved" name="approved" typeRef="boolean" />
      <output id="OutputClause_0zj89vy" label="Interest Rate" name="interestRate" typeRef="number" />
      <output id="OutputClause_11kv3ew" label="Risk Category" name="riskCategory" typeRef="string" />
      <rule id="DecisionRule_1u3ldqi">
        <inputEntry id="UnaryTests_1kbvykt">
          <text>&gt;= 750</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1l9yvky">
          <text>&gt;= 60000</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_100mjap">
          <text>true</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_097igzn">
          <text>4.0</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_0una7oc">
          <text>"LOW"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_0h5vgz8">
        <inputEntry id="UnaryTests_1rmtdx2">
          <text>[700..750)</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1c9u32j">
          <text>&gt;= 60000</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_05v0n4l">
          <text>true</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_1m2puci">
          <text>4.5</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_13nfo3t">
          <text>"LOW"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_04nj8rz">
        <inputEntry id="UnaryTests_1is6z8v">
          <text>[650..700)</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1hub7ce">
          <text>&gt;= 75000</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1xz8r1i">
          <text>true</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_0ff4z8e">
          <text>5.0</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_0lk3z5e">
          <text>"MEDIUM"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_01rd22m">
        <inputEntry id="UnaryTests_0ldspxx">
          <text>[600..650)</text>
        </inputEntry>
        <inputEntry id="UnaryTests_09lnlm8">
          <text>&gt;= 90000</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_01aqz32">
          <text>true</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_0s2fvu8">
          <text>5.5</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_1ojslct">
          <text>"MEDIUM"</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_04pi0fh">
        <inputEntry id="UnaryTests_0n18ruk">
          <text>&lt; 600</text>
        </inputEntry>
        <inputEntry id="UnaryTests_19mqk8s">
          <text>-</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1fdarks">
          <text>false</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_1sdvwhd">
          <text>0</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_083otdh">
          <text>"HIGH"</text>
        </outputEntry>
      </rule>
    </decisionTable>
  </decision>
  <inputData id="InputData_0pgvdj9" name="Credit Score" />
  <inputData id="InputData_1d4tv3s" name="Income" />
  <dmndi:DMNDI>
    <dmndi:DMNDiagram id="DMNDiagram_1bm0bil">
      <dmndi:DMNShape id="DMNShape_1dhfm3k" dmnElementRef="decision_1">
        <dc:Bounds height="80" width="180" x="157" y="151" />
      </dmndi:DMNShape>
      <dmndi:DMNShape id="DMNShape_0leqi3k" dmnElementRef="InputData_0pgvdj9">
        <dc:Bounds height="45" width="125" x="177" y="347" />
      </dmndi:DMNShape>
      <dmndi:DMNEdge id="DMNEdge_0pdqjmm" dmnElementRef="InformationRequirement_05bz4gw">
        <di:waypoint x="240" y="347" />
        <di:waypoint x="217" y="231" />
      </dmndi:DMNEdge>
      <dmndi:DMNShape id="DMNShape_12nbgcx" dmnElementRef="InputData_1d4tv3s">
        <dc:Bounds height="45" width="125" x="347" y="347" />
      </dmndi:DMNShape>
      <dmndi:DMNEdge id="DMNEdge_1tx13a6" dmnElementRef="InformationRequirement_1cxl1n8">
        <di:waypoint x="410" y="347" />
        <di:waypoint x="247" y="231" />
      </dmndi:DMNEdge>
    </dmndi:DMNDiagram>
  </dmndi:DMNDI>
</definitions>`
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
    ],
    dmnXml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" xmlns:di="http://www.omg.org/spec/DMN/20180521/DI/" id="definitions_1n9ai39" name="Decision" namespace="http://camunda.org/schema/1.0/dmn">
  <decision id="decision_loan" name="Loan Approval Matrix">
    <informationRequirement id="InformationRequirement_1xpk6gq">
      <requiredInput href="#InputData_0mlr9ck" />
    </informationRequirement>
    <informationRequirement id="InformationRequirement_1mxyr5c">
      <requiredInput href="#InputData_1fr38cm" />
    </informationRequirement>
    <informationRequirement id="InformationRequirement_1q1vxj7">
      <requiredInput href="#InputData_1mo5r33" />
    </informationRequirement>
    <decisionTable id="decisionTable_loan">
      <input id="input_credit" label="Credit Score">
        <inputExpression id="inputExpression_credit" typeRef="number">
          <text>creditScore</text>
        </inputExpression>
      </input>
      <input id="input_dti" label="Debt to Income Ratio">
        <inputExpression id="inputExpression_dti" typeRef="number">
          <text>debtToIncomeRatio</text>
        </inputExpression>
      </input>
      <input id="input_amount" label="Loan Amount">
        <inputExpression id="inputExpression_amount" typeRef="number">
          <text>loanAmount</text>
        </inputExpression>
      </input>
      <output id="output_approved" label="Approved" name="approved" typeRef="boolean" />
      <output id="output_downpayment" label="Required Down Payment" name="requiredDownPayment" typeRef="number" />
      <output id="output_term" label="Loan Term (years)" name="loanTerm" typeRef="number" />
      <rule id="DecisionRule_1qnbcfh">
        <inputEntry id="UnaryTests_19hyubw">
          <text>&gt;= 720</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1bmd1r1">
          <text>&lt;= 0.36</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0cfiqpm">
          <text>&lt;= 500000</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_19qhky4">
          <text>true</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_08f9c2g">
          <text>50000</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_172env2">
          <text>30</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_1xbpp0i">
        <inputEntry id="UnaryTests_0zrbbai">
          <text>[680..720)</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1jpku0y">
          <text>&lt;= 0.40</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0l6nnkn">
          <text>&lt;= 450000</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_03hwcoq">
          <text>true</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_02oykr6">
          <text>70000</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_1evct7j">
          <text>30</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_09wnv5p">
        <inputEntry id="UnaryTests_0rrz6ao">
          <text>[640..680)</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1cmkx1t">
          <text>&lt;= 0.43</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0cmti93">
          <text>&lt;= 400000</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_1d8lhlf">
          <text>true</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_1a6ujs8">
          <text>90000</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_0m06sa9">
          <text>20</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_05lx086">
        <inputEntry id="UnaryTests_15xsysr">
          <text>&lt; 640</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0pacawm">
          <text>-</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0i1bq58">
          <text>-</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_0gjw5by">
          <text>false</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_0anj5qx">
          <text>0</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_1s09hnj">
          <text>0</text>
        </outputEntry>
      </rule>
      <rule id="DecisionRule_0m1lyim">
        <inputEntry id="UnaryTests_0pydg7l">
          <text>-</text>
        </inputEntry>
        <inputEntry id="UnaryTests_0x982zr">
          <text>&gt; 0.43</text>
        </inputEntry>
        <inputEntry id="UnaryTests_1onw68o">
          <text>-</text>
        </inputEntry>
        <outputEntry id="LiteralExpression_0ga9st9">
          <text>false</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_0yp9ay8">
          <text>0</text>
        </outputEntry>
        <outputEntry id="LiteralExpression_1in3x2c">
          <text>0</text>
        </outputEntry>
      </rule>
    </decisionTable>
  </decision>
  <inputData id="InputData_0mlr9ck" name="Credit Score" />
  <inputData id="InputData_1fr38cm" name="Debt to Income Ratio" />
  <inputData id="InputData_1mo5r33" name="Loan Amount" />
  <dmndi:DMNDI>
    <dmndi:DMNDiagram id="DMNDiagram_0wgm30h">
      <dmndi:DMNShape id="DMNShape_0pq1qob" dmnElementRef="decision_loan">
        <dc:Bounds height="80" width="180" x="157" y="151" />
      </dmndi:DMNShape>
      <dmndi:DMNShape id="DMNShape_1c9x76z" dmnElementRef="InputData_0mlr9ck">
        <dc:Bounds height="45" width="125" x="97" y="347" />
      </dmndi:DMNShape>
      <dmndi:DMNEdge id="DMNEdge_0035vbc" dmnElementRef="InformationRequirement_1xpk6gq">
        <di:waypoint x="160" y="347" />
        <di:waypoint x="187" y="231" />
      </dmndi:DMNEdge>
      <dmndi:DMNShape id="DMNShape_10qkcru" dmnElementRef="InputData_1fr38cm">
        <dc:Bounds height="45" width="125" x="277" y="347" />
      </dmndi:DMNShape>
      <dmndi:DMNEdge id="DMNEdge_1n2jaf0" dmnElementRef="InformationRequirement_1mxyr5c">
        <di:waypoint x="340" y="347" />
        <di:waypoint x="247" y="231" />
      </dmndi:DMNEdge>
      <dmndi:DMNShape id="DMNShape_1d50vbs" dmnElementRef="InputData_1mo5r33">
        <dc:Bounds height="45" width="125" x="457" y="347" />
      </dmndi:DMNShape>
      <dmndi:DMNEdge id="DMNEdge_09lf8b2" dmnElementRef="InformationRequirement_1q1vxj7">
        <di:waypoint x="520" y="347" />
        <di:waypoint x="297" y="231" />
      </dmndi:DMNEdge>
    </dmndi:DMNDiagram>
  </dmndi:DMNDI>
</definitions>`
  },
  // More DMN instances would be here
};

// Create a simple DMN Viewer Component
const DmnXmlViewer: React.FC<{ xml: string }> = ({ xml }) => {
  return (
    <div className="border rounded-md">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
        <pre className="text-xs whitespace-pre-wrap">{xml}</pre>
      </div>
    </div>
  );
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
          <TabsTrigger value="viewer">DMN Viewer</TabsTrigger>
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

        <TabsContent value="viewer">
          <Card>
            <CardHeader>
              <CardTitle>DMN Viewer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <DmnXmlViewer xml={dmnData.dmnXml} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DmnDetails;
