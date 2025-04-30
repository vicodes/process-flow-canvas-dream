
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopNavbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Processes',
      icon: <Home className="w-5 h-5 mr-2" />,
      href: '/',
      active: location.pathname === '/',
    },
    {
      name: 'Process Modeler',
      icon: <PenSquare className="w-5 h-5 mr-2" />,
      href: '/modeler',
      active: location.pathname === '/modeler',
    },
    {
      name: 'BPMN Generator',
      icon: <MessageSquare className="w-5 h-5 mr-2" />,
      href: '/generator',
      active: location.pathname === '/generator',
    },
  ];

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <h1 className="font-bold text-xl text-primary-700 mr-8">BPMN Dashboard</h1>
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button 
                  variant={item.active ? "default" : "ghost"} 
                  className="flex items-center"
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">BPMN Dashboard v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
