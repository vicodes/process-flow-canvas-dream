
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import BpmnViewer from '@/components/bpmn/BpmnViewer';
import InstanceSummary from '@/components/instances/InstanceSummary';
import TaskTimeline from '@/components/instances/TaskTimeline';
import { ProcessInstance } from '@/context/AppContext';
import api from '@/services/apiService';

const ProcessDetails: React.FC = () => {
  const { processId } = useParams<{ processId: string }>();
  const [instance, setInstance] = useState<ProcessInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagramXml, setDiagramXml] = useState<string>('');
  const [diagramLoading, setDiagramLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  
  // Fetch process instance
  useEffect(() => {
    const fetchInstance = async () => {
      if (!processId) return;
      
      setLoading(true);
      
      try {
        const instanceData = await api.getProcessInstance(processId);
        setInstance(instanceData);
      } catch (error) {
        console.error('Error fetching process instance:', error);
        toast.error('Failed to load process instance');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstance();
  }, [processId]);
  
  // Fetch BPMN diagram
  useEffect(() => {
    const fetchDiagram = async () => {
      if (!instance) return;
      
      setDiagramLoading(true);
      
      try {
        const xml = await api.getProcessXml(instance.processId);
        setDiagramXml(xml);
      } catch (error) {
        console.error('Error fetching BPMN diagram:', error);
        toast.error('Failed to load BPMN diagram');
      } finally {
        setDiagramLoading(false);
      }
    };
    
    fetchDiagram();
  }, [instance]);
  
  // Fetch task history
  useEffect(() => {
    const fetchTasks = async () => {
      if (!processId) return;
      
      setTasksLoading(true);
      
      try {
        const taskHistory = await api.getInstanceTaskHistory(processId);
        setTasks(taskHistory);
      } catch (error) {
        console.error('Error fetching task history:', error);
        toast.error('Failed to load task history');
      } finally {
        setTasksLoading(false);
      }
    };
    
    fetchTasks();
  }, [processId]);
  
  // Determine active element in diagram
  const getActiveElementId = () => {
    if (!tasks.length) return undefined;
    
    // Find the active task, or the last one if none is active
    const activeTask = tasks.find(task => task.status === 'active');
    const taskNameToElementId: Record<string, string> = {
      'Review Order': 'Activity_1',
      'Process Payment': 'Activity_2',
      'Send Rejection': 'Activity_3',
      'Prepare Package': 'Activity_1',
      'Select Carrier': 'Activity_2',
      'Update Tracking': 'Activity_5',
    };
    
    return activeTask ? taskNameToElementId[activeTask.taskName] : undefined;
  };
  
  return (
    <div className="space-y-6">
      <InstanceSummary instance={instance} loading={loading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Process Diagram</h2>
            
            {diagramLoading ? (
              <div className="flex items-center justify-center h-96 bg-gray-50 border border-gray-200 rounded-lg">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : (
              diagramXml ? (
                <BpmnViewer xml={diagramXml} activeElementId={getActiveElementId()} />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-500">No diagram available</p>
                </div>
              )
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Task History</h2>
            <TaskTimeline tasks={tasks} isLoading={tasksLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessDetails;
