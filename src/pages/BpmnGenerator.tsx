
import React, { useState } from 'react';
import BpmnGeneratorChat from '@/components/generator/BpmnGeneratorChat';
import BpmnViewer from '@/components/bpmn/BpmnViewer';

const BpmnGenerator: React.FC = () => {
  const [generatedBpmn, setGeneratedBpmn] = useState<string>('');
  
  const handleBpmnGenerated = (xml: string) => {
    setGeneratedBpmn(xml);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">BPMN Generator</h1>
        <div className="text-sm text-gray-500">Use AI to generate BPMN diagrams from natural language</div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[700px]">
          <BpmnGeneratorChat onBpmnGenerated={handleBpmnGenerated} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[700px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Generated Diagram Preview</h2>
          {generatedBpmn ? (
            <div className="flex-1 relative">
              <BpmnViewer xml={generatedBpmn} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 bg-gray-50/50 rounded-lg">
              <div className="text-center p-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-600">No diagram yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Describe a process to the assistant to generate a BPMN diagram
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BpmnGenerator;
