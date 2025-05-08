
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-soft">      
      <div className="flex flex-1">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out pt-4", 
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}>
          <div className="container px-4 py-2 mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
