
import { useEffect, useRef, useCallback } from 'react';
import BpmnJS from 'bpmn-js';
import { toast } from 'sonner';

interface UseBpmnViewerProps {
  xml: string;
  activeElementId?: string;
  onNavigateToDmn?: (dmnId: string) => void;
  isHandTool?: boolean;
}

export const useBpmnViewer = ({
  xml,
  activeElementId,
  onNavigateToDmn,
  isHandTool = false
}: UseBpmnViewerProps) => {
  const bpmnViewerRef = useRef<BpmnJS | null>(null);

  const initBpmnViewer = useCallback((container: HTMLDivElement) => {
    // Clean up existing viewer if it exists
    if (bpmnViewerRef.current) {
      bpmnViewerRef.current.destroy();
      bpmnViewerRef.current = null;
    }

    // Create new viewer instance
    const viewer = new BpmnJS({
      container,
      additionalModules: [],
      keyboard: {
        bindTo: document
      }
    });

    bpmnViewerRef.current = viewer;

    // Import XML
    return viewer.importXML(xml)
      .then(({ warnings }) => {
        if (warnings.length) {
          console.warn('BPMN import warnings:', warnings);
        }
        
        const canvas = viewer.get('canvas');
        const eventBus = viewer.get('eventBus');
        const dragging = viewer.get('dragging');
        
        // Adjust the view box to fit the diagram
        canvas.zoom('fit-viewport', 'auto');
        
        // Configure dragging behavior
        if (dragging && eventBus) {
          eventBus.on('element.mousedown', function(e) {
            // Only enable dragging on the canvas, not on diagram elements
            if (isHandTool || !e.element.id || e.element.id === '__implicitroot' || e.element.type === 'bpmn:Process') {
              dragging.init(e, 'hand');
            }
          });
        }
        
        // Add click handler for DMN tasks
        if (eventBus && onNavigateToDmn && !isHandTool) {
          eventBus.on('element.click', (event) => {
            const element = event.element;
            
            // Check if the clicked element is a DMN task
            if (element.type === 'bpmn:BusinessRuleTask' || 
                (element.businessObject && element.businessObject.implementation === 'dmn')) {
              console.log('DMN task clicked:', element);
              
              // Extract DMN ID from the element if available
              let dmnId = extractDmnId(element);
              
              // Navigate to DMN details page
              onNavigateToDmn(dmnId);
            }
          });
        }
        
        // Highlight active element if provided
        if (activeElementId) {
          highlightElement(activeElementId);
        }

        return viewer;
      })
      .catch((err) => {
        console.error('BPMN import error:', err);
        toast.error('Failed to load BPMN diagram');
        throw err;
      });
  }, [xml, activeElementId, onNavigateToDmn, isHandTool]);

  // Extract DMN ID from element
  const extractDmnId = (element: any) => {
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
    
    // If still no DMN ID, use default
    if (!dmnId) {
      dmnId = 'dmn-1'; // Default DMN ID if none is found
      console.log('No DMN ID found in element, using default:', dmnId);
    }

    return dmnId;
  };

  // Highlight a specific element
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

  // Canvas manipulation methods
  const zoomIn = () => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      canvas.zoom(canvas.zoom() * 1.2);
    }
  };

  const zoomOut = () => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      canvas.zoom(canvas.zoom() / 1.2);
    }
  };

  const resetZoom = () => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      canvas.zoom('fit-viewport', 'auto');
    }
  };

  // Cleanup function
  const destroyViewer = () => {
    if (bpmnViewerRef.current) {
      bpmnViewerRef.current.destroy();
      bpmnViewerRef.current = null;
    }
  };

  return {
    bpmnViewerRef,
    initBpmnViewer,
    zoomIn,
    zoomOut,
    resetZoom,
    destroyViewer,
    highlightElement
  };
};
