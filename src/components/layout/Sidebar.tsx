
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  List, 
  PenSquare, 
  ArrowLeft, 
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  setCollapsed 
}) => {
  const location = useLocation();
  
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      name: 'Processes',
      icon: <Home className="w-5 h-5" />,
      href: '/',
      active: location.pathname === '/',
    },
    {
      name: 'Instance Details',
      icon: <List className="w-5 h-5" />,
      href: location.pathname.startsWith('/processes/') ? location.pathname : '/processes/inst-001',
      active: location.pathname.startsWith('/processes/'),
    },
    {
      name: 'Process Modeler',
      icon: <PenSquare className="w-5 h-5" />,
      href: '/modeler',
      active: location.pathname === '/modeler',
    },
  ];

  return (
    <aside 
      className={cn(
        'fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-white border-r shadow-sm',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center justify-between px-4 py-5 border-b",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-xl text-primary-700">BPMN Dashboard</h1>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'nav-item',
                item.active && 'active'
              )}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
        
        <div className={cn(
          "p-4 border-t",
          collapsed ? "text-center" : ""
        )}>
          {!collapsed && (
            <div className="text-sm text-gray-500">
              <p>BPMN Dashboard v1.0</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
