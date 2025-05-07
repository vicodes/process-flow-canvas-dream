import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Code, History } from 'lucide-react';
import { toast } from 'sonner';
import BpmnViewer from '@/components/bpmn/BpmnViewer';
import InstanceSummary from '@/components/instances/InstanceSummary';
import TaskTimeline from '@/components/instances/TaskTimeline';
import ProcessVariables from '@/components/instances/ProcessVariables';
import { ProcessInstance } from '@/context/AppContext';
import api from '@/services/apiService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProcessDetails: React.FC = () => {
  const { processId } = useParams<{ processId: string }>();
  const [instance, setInstance] = useState<ProcessInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagramXml, setDiagramXml] = useState<string>('');
  const [diagramLoading, setDiagramLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [variables, setVariables] = useState<any[]>([]);
  const [variablesLoading, setVariablesLoading] = useState(true);

  function getVariables(variables: Map<never, never>) {
    const variablesMap = new Map(Object.entries(variables));
    const variableObj = []
    variablesMap.forEach((value, key) =>{
      variableObj.push({
        name: key,
        value: JSON.stringify(value),
        type: typeof value,
        // scope: string;
        enumerable: true,
      })
    });
    return variableObj;
  }

  function getHistory(sequenceExecutions: Map<string, never>) {
    const history = []
    const sequenceExecutionsMap = new Map(Object.entries(sequenceExecutions));
    sequenceExecutionsMap.forEach((value, key) =>{
      history.push({
        taskId: `${key}`,
        taskName: `${value.nodeInformation.name}`,
        scopeId: `${value.nodeInformation.scopeId}`,
        status: `${value.state}`,
        // timestamp: value.toISOString(),
      });
    });
    return history;
  }

  // Fetch process instance
  useEffect(() => {
    const fetchInstance = async () => {
      if (!processId) return;
      setLoading(true);
      try {
        const instanceData = await api.getProcessInstance(processId);
        setInstance(instanceData);
        setDiagramXml(instanceData.bpmnXML);
        setVariables(getVariables(instanceData.variables));
        setTasks(getHistory(instanceData.sequenceExecutions))
      } catch (error) {
        console.error('Error fetching process instance:', error);
        toast.error('Failed to load process instance');
      } finally {
        setLoading(false);
        setDiagramLoading(false);
        setVariablesLoading(false);
        setTasksLoading(false);
      }
    };
    fetchInstance();
  }, [processId]);
  
  // Determine active element in diagram
  const getActiveElementId = () => {
    if (!tasks.length) return undefined;
    // Find the active task, or the last one if none is active
    const activeTask = tasks[tasks.length - 1].taskId;
    return activeTask ? activeTask : undefined;
  };
  
  return (
    <div className="space-y-6">
      <InstanceSummary instance={instance} loading={loading} />
      
      {/* Process Diagram - Full width */}
      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Process Diagram</h2>
        
        {diagramLoading ? (
          <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Loader2 className="w-8 h-8 text-primary-500 dark:text-primary-400 animate-spin" />
          </div>
        ) : (
          diagramXml ? (
            <div className="h-[300px] relative">
              <BpmnViewer xml={diagramXml}
                          activeElementId={getActiveElementId()}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No diagram available</p>
            </div>
          )
        )}
      </div>
      
      {/* Variables and Task History - Tabbed interface at bottom */}
      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Tabs defaultValue="variables" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="variables" className="flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Process Variables
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="w-4 h-4 mr-2" />
              Task History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="variables" className="mt-0">
            <ScrollArea className="h-[300px] w-full">
              <ProcessVariables variables={variables} isLoading={variablesLoading} />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <ScrollArea className="h-[300px] w-full">
              <TaskTimeline tasks={tasks} isLoading={tasksLoading} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProcessDetails;
