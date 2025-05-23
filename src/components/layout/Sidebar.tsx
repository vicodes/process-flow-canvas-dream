
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  List, 
  PenSquare,
  MessageSquare,
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
    {
      name: 'BPMN Generator',
      icon: <MessageSquare className="w-5 h-5" />,
      href: '/generator',
      active: location.pathname === '/generator',
    }
  ];

  return (
    <aside 
      className={cn(
        'fixed top-[64px] left-0 z-40 h-[calc(100vh-64px)] transition-all duration-300 ease-in-out bg-white border-r shadow-sm',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <button
          onClick={toggleCollapse}
          className="p-2 mx-auto my-4 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-md transition-colors',
                collapsed ? 'justify-center' : 'justify-start',
                item.active 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              title={collapsed ? item.name : ""}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};
