
import React, { useState } from 'react';
import { toast } from 'sonner';
import BpmnModeler from '@/components/bpmn/BpmnModeler';
import { useApp } from '@/context/AppContext';
import { v4 as uuidv4 } from '@/utils/uuid';

const ProcessModeler: React.FC = () => {
  const { saveDiagram } = useApp();
  const [currentDiagramId] = useState(`diagram-${uuidv4()}`);
  
  const handleSaveDiagram = (xml: string) => {
    try {
      // Save diagram in context
      saveDiagram(currentDiagramId, xml);
      
      // Show success toast
      toast.success('Diagram saved successfully!', {
        description: 'Your BPMN diagram has been saved.',
      });
    } catch (error) {
      console.error('Error saving diagram:', error);
      toast.error('Failed to save diagram');
    }
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Process Modeler</h1>
      </div>
      
      <div className="bg-white p-2 lg:p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="h-[800px]">
          <BpmnModeler onSave={handleSaveDiagram} />
        </div>
      </div>
    </div>
  );
};

export default ProcessModeler;
