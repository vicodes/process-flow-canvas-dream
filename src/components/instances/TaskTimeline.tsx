
import React from 'react';
import { format } from 'date-fns';

type TaskStatus = 'active' | 'completed' | 'pending' | 'failed';

interface Task {
  taskId: string;
  taskName: string;
  status: TaskStatus;
  timestamp: string;
  assignee: string;
}

interface TaskTimelineProps {
  tasks: Task[];
  isLoading: boolean;
}

const TaskTimeline: React.FC<TaskTimelineProps> = ({ tasks, isLoading }) => {
  // Format date and time
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-6 animate-pulse">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex space-x-4">
            <div className="w-3 h-3 bg-gray-300 rounded-full mt-1.5"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No task history available</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute h-full w-0.5 bg-gray-200 left-1.5"></div>
        
        {/* Tasks */}
        <div className="space-y-6">
          {tasks.map((task, index) => (
            <div key={task.taskId} className="flex space-x-4 relative animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
              {/* Timeline dot */}
              <div className={`timeline-dot ${task.status}`}></div>
              
              {/* Task content */}
              <div className="flex-1 pt-0.5">
                <h4 className="font-semibold text-gray-900">{task.taskName}</h4>
                <div className="text-sm text-gray-600 mb-1">
                  {formatDateTime(task.timestamp)}
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-gray-600">Assignee: <span className="font-medium">{task.assignee}</span></span>
                  <span className={`status-badge ${task.status}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskTimeline;
