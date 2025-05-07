
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to OrchesT</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Business Process Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video rounded-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                alt="Dashboard preview" 
                className="w-full h-full object-cover" 
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage your business processes in one place. Monitor active instances and review completed processes.
            </p>
            <div className="flex justify-end">
              <Button asChild>
                <Link to="/processes/inst-001">View Processes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Decision Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video rounded-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
                alt="DMN preview" 
                className="w-full h-full object-cover" 
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Access and analyze your decision models. View execution history and verify business rules are working correctly.
            </p>
            <div className="flex justify-end">
              <Button asChild>
                <Link to="/dmns">View Decisions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
