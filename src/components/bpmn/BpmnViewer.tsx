
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

import { useBpmnViewer } from '@/hooks/useBpmnViewer';
import { exportDiagram } from '@/utils/diagramExport';
import BpmnViewerControls from './BpmnViewerControls';

interface BpmnViewerProps {
  xml: string;
  activeElementId?: string;
}

const BpmnViewer: React.FC<BpmnViewerProps> = ({ xml, activeElementId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHandTool, setIsHandTool] = useState(false);
  const navigate = useNavigate();

  // Handle navigation to DMN page
  const handleNavigateToDmn = (dmnId: string) => {
    toast.info(`Navigating to DMN: ${dmnId}`);
    navigate(`/dmns/${dmnId}`);
  };

  // Initialize BPMN viewer with our custom hook
  const {
    bpmnViewerRef,
    initBpmnViewer,
    zoomIn,
    zoomOut,
    resetZoom,
    destroyViewer
  } = useBpmnViewer({
    xml,
    activeElementId,
    onNavigateToDmn: handleNavigateToDmn,
    isHandTool
  });

  // Initialize viewer when component mounts or when dependencies change
  useEffect(() => {
    if (containerRef.current) {
      initBpmnViewer(containerRef.current)
        .then(() => {
          setIsLoaded(true);
        })
        .catch(err => {
          console.error("Failed to initialize BPMN viewer:", err);
        });
    }
    
    return () => {
      destroyViewer();
    };
  }, [initBpmnViewer, destroyViewer]);

  // Toggle hand tool
  const toggleHandTool = () => {
    setIsHandTool(!isHandTool);
    
    // Update the viewer's container cursor based on hand tool state
    if (containerRef.current) {
      containerRef.current.style.cursor = !isHandTool ? 'grab' : 'default';
    }
  };

  // Handle export
  const handleExport = (format: 'svg' | 'png') => {
    exportDiagram(bpmnViewerRef.current, format);
  };

  return (
    <div className="bpmn-container relative">
      <div 
        ref={containerRef} 
        className={`bpmn-viewer-container w-full h-[600px] ${isHandTool ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      ></div>
      
      {isLoaded && (
        <BpmnViewerControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onZoomReset={resetZoom}
          onExport={handleExport}
          onToggleHandTool={toggleHandTool}
          isHandTool={isHandTool}
        />
      )}
    </div>
  );
};

export default BpmnViewer;
