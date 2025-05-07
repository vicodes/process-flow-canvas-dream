
import React from 'react';
import { ZoomIn, ZoomOut, Move, Download, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BpmnViewerControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onExport: (format: 'svg' | 'png') => void;
  onToggleHandTool: () => void;
  isHandTool: boolean;
}

const BpmnViewerControls: React.FC<BpmnViewerControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onExport,
  onToggleHandTool,
  isHandTool,
}) => {
  return (
    <div className="bpmn-controls absolute top-2 right-2 flex flex-col gap-1 bg-white dark:bg-gray-800 p-1 rounded-md shadow-md">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onZoomIn} 
        className="bpmn-control-btn" 
        aria-label="Zoom in"
      >
        <ZoomIn className="w-5 h-5" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onZoomOut} 
        className="bpmn-control-btn" 
        aria-label="Zoom out"
      >
        <ZoomOut className="w-5 h-5" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onZoomReset} 
        className="bpmn-control-btn" 
        aria-label="Reset zoom"
      >
        <Move className="w-5 h-5" />
      </Button>
      
      <Button 
        variant={isHandTool ? "secondary" : "ghost"}
        size="icon" 
        onClick={onToggleHandTool} 
        className="bpmn-control-btn" 
        aria-label="Hand tool"
      >
        <Hand className="w-5 h-5" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="bpmn-control-btn">
            <Download className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onExport('svg')}>
            Export as SVG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('png')}>
            Export as PNG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BpmnViewerControls;
