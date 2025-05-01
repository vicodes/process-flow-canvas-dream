
import React from 'react';
import { format } from 'date-fns';
import { ArrowLeftCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProcessInstance } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface InstanceSummaryProps {
  instance: ProcessInstance | null;
  loading: boolean;
}

const InstanceSummary: React.FC<InstanceSummaryProps> = ({ instance, loading }) => {
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleCancel = () => {
    // Mock cancel functionality
    setCancelDialogOpen(false);
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="card-gradient-border p-5 shadow-sm rounded-lg animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }
  
  if (!instance) {
    return (
      <div className="card-gradient-border p-5 shadow-sm rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xs font-semibold text-gray-800">
              Instance Not Found
            </h2>
            <p className="text-gray-600">
              The requested process instance could not be found
            </p>
          </div>
          <Button variant="outline" onClick={handleBack} className="flex space-x-2 items-center">
            <ArrowLeftCircle className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card-gradient-border p-5 shadow-sm rounded-lg animate-fade-in">
      <div className="flex flex-wrap justify-between items-center">
        <div className="mb-2 sm:mb-0">
          <h2 className="text-xs font-bold text-gray-800 flex items-center">
            {instance.processId}
            {instance.status === 'RUNNING' && (
              <span className="ml-2 inline-block w-2 h-2 bg-success rounded-full animate-pulse"></span>
            )}
          </h2>
          <p className="text-gray-600 text-xs">
            {instance.processName} - {instance.processVersion}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleBack} className="flex space-x-1 items-center">
            <ArrowLeftCircle className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          {instance.status === 'RUNNING' && (
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancel Instance
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md glass">
                <DialogHeader>
                  <DialogTitle className="flex items-center text-destructive">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Cancel Process Instance
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Are you sure you want to cancel this process instance? This action cannot be undone.
                </DialogDescription>
                <DialogFooter className="flex space-x-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setCancelDialogOpen(false)}
                  >
                    Keep Running
                  </Button>
                  <Button
                    variant="destructive" 
                    onClick={handleCancel}
                  >
                    Yes, Cancel Instance
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="bg-white p-3 rounded shadow-sm border border-gray-100 h-12">
          <p className="text-xs font-medium text-gray-500">Status</p>
          <div className="mt-1">
            <span className={`status-badge ${instance.status}`}>
              {instance.status === 'RUNNING' && (
                <span className="mr-1.5 h-2 w-2 rounded-full bg-success inline-block"></span>
              )}
              {instance.status === 'COMPLETED' && (
                <span className="mr-1.5 h-2 w-2 rounded-full bg-primary-700 inline-block"></span>
              )}
              {instance.status === 'HOLD' && (
                <span className="mr-1.5 h-2 w-2 rounded-full bg-warning inline-block"></span>
              )}
              {instance.status === 'INCIDENT' && (
                <span className="mr-1.5 h-2 w-2 rounded-full bg-destructive inline-block"></span>
              )}
              {instance.status}
            </span>
          </div>
        </div>
        
        <div className="bg-white p-1 rounded shadow-sm border border-gray-100 h-12">
          <p className="text-xs font-medium text-gray-500">Process</p>
          <p className="text-xs mt-1 font-semibold text-gray-800">
            {instance.processName}
          </p>
        </div>
        
        <div className="bg-white p-1 rounded shadow-sm border border-gray-100 h-12">
          <p className="text-xs font-medium text-gray-500">Start Date</p>
          <p className="text-xs mt-1 font-semibold text-gray-800">
            {formatDate(instance.startDate)}
          </p>
        </div>
        
        <div className="bg-white p-1 rounded shadow-sm border border-gray-100 h-12">
          <p className="text-xs font-medium text-gray-500">End Date</p>
          <p className="text-xs mt-1 font-semibold text-gray-800">
            {formatDate(instance.endDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstanceSummary;
