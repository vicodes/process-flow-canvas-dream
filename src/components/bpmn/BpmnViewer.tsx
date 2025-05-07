
import React, { useRef, useEffect, useState, useCallback } from 'react';
import BpmnJS from 'bpmn-js';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import { ZoomIn, ZoomOut, Move, Download, Hand } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BpmnViewerProps {
  xml: string;
  activeElementId?: string;
}

const BpmnViewer: React.FC<BpmnViewerProps> = ({ xml, activeElementId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bpmnViewerRef = useRef<BpmnJS | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHandTool, setIsHandTool] = useState(false);
  const navigate = useNavigate();

  const initBpmnViewer = useCallback(() => {
    if (containerRef.current) {
      // Clean up existing viewer if it exists
      if (bpmnViewerRef.current) {
        bpmnViewerRef.current.destroy();
        bpmnViewerRef.current = null;
      }

      // Create new viewer instance
      const viewer = new BpmnJS({
        container: containerRef.current,
        // Custom configuration
        additionalModules: [
          // Add any additional modules here if needed
        ],
        keyboard: {
          bindTo: document
        }
      });

      bpmnViewerRef.current = viewer;

      // Import XML
      viewer.importXML(xml)
        .then(({ warnings }) => {
          if (warnings.length) {
            console.warn('BPMN import warnings:', warnings);
          }
          
          const canvas = viewer.get('canvas');
          
          // Adjust the view box to fit the diagram
          canvas.zoom('fit-viewport', 'auto');
          
          // Get eventBus and dragging modules once
          const eventBus = viewer.get('eventBus');
          const dragging = viewer.get('dragging');
          
          if (dragging && eventBus) {
            // Only enable dragging on the canvas, not on diagram elements
            eventBus.on('element.mousedown', function(e) {
              // Only enable dragging on the canvas, not on diagram elements
              if (isHandTool || !e.element.id || e.element.id === '__implicitroot' || e.element.type === 'bpmn:Process') {
                dragging.init(e, 'hand');
              }
            });
          }
          
          // Add click handler for DMN tasks using the already defined eventBus
          if (eventBus) {
            eventBus.on('element.click', (event) => {
              // Don't navigate when hand tool is active
              if (isHandTool) {
                return;
              }
              
              const element = event.element;
              
              // Check if the clicked element is a DMN task
              if (element.type === 'bpmn:BusinessRuleTask' || 
                  (element.businessObject && element.businessObject.implementation === 'dmn')) {
                console.log('DMN task clicked:', element);
                
                // Extract DMN ID from the element if available
                let dmnId = null;
                
                // Try to get DMN ID from businessObject properties
                if (element.businessObject) {
                  // Check different possible properties where DMN ID might be stored
                  dmnId = element.businessObject.decisionRef 
                        || element.businessObject.dmnId 
                        || element.businessObject.dmnTaskId;
                        
                  // If no direct DMN ID, try to extract from other attributes
                  if (!dmnId && element.businessObject.extensionElements) {
                    // Process extension elements if they exist
                    const extensions = element.businessObject.extensionElements.values;
                    for (const ext of extensions) {
                      if (ext.dmnId || ext.decisionRef || ext.decisionRefId) {
                        dmnId = ext.dmnId || ext.decisionRef || ext.decisionRefId;
                        break;
                      }
                    }
                  }
                }
                
                // If still no DMN ID, use element ID as fallback
                if (!dmnId) {
                  dmnId = 'dmn-1'; // Default DMN ID if none is found
                  console.log('No DMN ID found in element, using default:', dmnId);
                }
                
                // Navigate to DMN details page
                toast.info(`Navigating to DMN: ${dmnId}`);
                navigate(`/dmns/${dmnId}`);
              }
            });
          }
          
          setIsLoaded(true);
          
          // Highlight active element if provided
          if (activeElementId) {
            highlightElement(activeElementId);
          }
        })
        .catch((err) => {
          console.error('BPMN import error:', err);
          toast.error('Failed to load BPMN diagram');
        });
    }
  }, [xml, activeElementId, navigate, isHandTool]);

  useEffect(() => {
    initBpmnViewer();

    return () => {
      // Clean up on component unmount
      if (bpmnViewerRef.current) {
        bpmnViewerRef.current.destroy();
        bpmnViewerRef.current = null;
      }
    };
  }, [initBpmnViewer]);

  // Function to highlight a specific element
  const highlightElement = (elementId: string) => {
    if (!bpmnViewerRef.current) return;
    
    const elementRegistry = bpmnViewerRef.current.get('elementRegistry');
    const canvas = bpmnViewerRef.current.get('canvas');
    
    try {
      // Find the element
      const element = elementRegistry.get(elementId);
      
      if (element) {
        // Add highlighted class
        canvas.addMarker(elementId, 'highlighted');
        
        // Center and zoom to the element
        canvas.zoom('fit-viewport', 'auto', element);
      }
    } catch (error) {
      console.error('Element highlighting error:', error);
    }
  };

  const handleZoomIn = () => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      canvas.zoom(canvas.zoom() * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      canvas.zoom(canvas.zoom() / 1.2);
    }
  };

  const handleZoomReset = () => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      canvas.zoom('fit-viewport', 'auto');
    }
  };

  const toggleHandTool = () => {
    setIsHandTool(!isHandTool);
    
    // Update the viewer's container cursor based on hand tool state
    if (containerRef.current) {
      containerRef.current.style.cursor = !isHandTool ? 'grab' : 'default';
    }
  };
  
  const handleExport = (format: 'svg' | 'png') => {
    if (!bpmnViewerRef.current) return;
    
    try {
      if (format === 'svg') {
        bpmnViewerRef.current.saveSVG()
          .then(({ svg }) => {
            downloadFile(svg, 'process-diagram.svg', 'image/svg+xml');
            toast.success('SVG diagram downloaded');
          })
          .catch((err) => {
            console.error('SVG export error:', err);
            toast.error('Failed to export diagram');
          });
      } else {
        // For PNG, we use saveSVG and convert it
        bpmnViewerRef.current.saveSVG()
          .then(({ svg }) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              
              const dataUrl = canvas.toDataURL('image/png');
              downloadFile(dataUrl, 'process-diagram.png', 'image/png');
              toast.success('PNG diagram downloaded');
            };
            
            img.onerror = () => {
              toast.error('Failed to convert diagram to PNG');
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
          })
          .catch((err) => {
            console.error('PNG export error:', err);
            toast.error('Failed to export diagram');
          });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export diagram');
    }
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const link = document.createElement('a');
    const blob = new Blob([content], { type: contentType });
    
    link.href = contentType.startsWith('image/png') 
      ? content 
      : URL.createObjectURL(blob);
    
    link.download = fileName;
    link.click();
    
    if (!contentType.startsWith('image/png')) {
      URL.revokeObjectURL(link.href);
    }
  };

  return (
    <div className="bpmn-container relative">
      <div 
        ref={containerRef} 
        className={`bpmn-viewer-container w-full h-[600px] ${isHandTool ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      ></div>
      
      {isLoaded && (
        <div className="bpmn-controls absolute top-2 right-2 flex flex-col gap-1 bg-white dark:bg-gray-800 p-1 rounded-md shadow-md">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomIn} 
            className="bpmn-control-btn" 
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomOut} 
            className="bpmn-control-btn" 
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomReset} 
            className="bpmn-control-btn" 
            aria-label="Reset zoom"
          >
            <Move className="w-5 h-5" />
          </Button>
          
          <Button 
            variant={isHandTool ? "secondary" : "ghost"}
            size="icon" 
            onClick={toggleHandTool} 
            className="bpmn-control-btn" 
            aria-label="Hand tool"
          >
            <Move className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bpmn-control-btn">
                <Download className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('svg')}>
                Export as SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('png')}>
                Export as PNG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default BpmnViewer;
