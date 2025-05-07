
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProcessInstance } from '@/context/AppContext';

interface ProcessInstanceTableProps {
  instances: ProcessInstance[];
  loading: boolean;
}

const ProcessInstanceTable: React.FC<ProcessInstanceTableProps> = ({ 
  instances, 
  loading 
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalItems = instances.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentInstances = instances.slice(startIndex, endIndex);
  
  // Pagination controls
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };
  
  // View instance details
  const handleViewInstance = (instanceId: string) => {
    navigate(`/processes/${instanceId}`);
  };
  
  // Empty state
  if (!loading && instances.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center animate-fade-in">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
              <path d="M20 7.5V16.5M20 7.5L12 11L4 7.5M20 7.5L12 4L4 7.5M20 16.5L12 20L4 16.5M20 16.5L12 13L4 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Process Instances Found</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            No process instances match your current filter criteria. Try adjusting your filters or create a new process instance.
          </p>
          <Button onClick={() => navigate('/modeler')} className="btn-hover-glow">
            Create New Process
          </Button>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  // Render table with data
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentInstances.map((instance) => (
              <tr 
                key={instance.id} 
                className="table-row-hover"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {instance.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {instance.processName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {instance.processVersion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`status-badge ${instance.status}`}>
                    {instance.status === 'active' && (
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-success inline-block"></span>
                    )}
                    {instance.status === 'completed' && (
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-primary-700 inline-block"></span>
                    )}
                    {instance.status === 'pending' && (
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-warning inline-block"></span>
                    )}
                    {instance.status === 'failed' && (
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-destructive inline-block"></span>
                    )}
                    {instance.status.charAt(0).toUpperCase() + instance.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(instance.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(instance.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewInstance(instance.id)}
                    className="hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{totalItems}</span> instances
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="mr-2"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            
            <div className="hidden md:flex items-center space-x-1 mx-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="icon"
                  className={`w-8 h-8 ${currentPage === index + 1 ? 'bg-primary-700' : ''}`}
                  onClick={() => handlePageClick(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessInstanceTable;
