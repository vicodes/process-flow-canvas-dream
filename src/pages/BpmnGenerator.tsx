
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">BPMN Generator</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[700px]">
          <BpmnGeneratorChat onBpmnGenerated={handleBpmnGenerated} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[700px]">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          {generatedBpmn ? (
            <BpmnViewer xml={generatedBpmn} />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <p>Describe a process to the assistant to generate a BPMN diagram</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BpmnGenerator;
