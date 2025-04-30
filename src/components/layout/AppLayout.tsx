
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-gradient-soft">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out", 
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <div className="container px-4 py-6 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
