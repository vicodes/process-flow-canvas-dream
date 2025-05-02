
import React, { useEffect, useRef } from 'react';
import DmnJS from 'dmn-js/dist/dmn-navigated-viewer.production.min.js';
import 'dmn-js/dist/assets/dmn-js-shared.css';
import 'dmn-js/dist/assets/dmn-js-drd.css';
import 'dmn-js/dist/assets/dmn-js-decision-table.css';
import 'dmn-js/dist/assets/dmn-js-literal-expression.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn.css';

interface DmnViewerProps {
  xml: string;
  className?: string;
}

const DmnViewer: React.FC<DmnViewerProps> = ({ xml, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize DMN viewer
    const viewer = new DmnJS({
      container: containerRef.current,
      height: '100%',
      width: '100%'
    });

    viewerRef.current = viewer;

    try {
      // Import the DMN XML
      viewer.importXML(xml, (err: Error) => {
        if (err) {
          console.error('Error rendering DMN:', err);
          return;
        }

        // Access the active viewer
        const activeViewer = viewer.getActiveViewer();
        if (activeViewer) {
          // Adjust the view to fit the diagram
          const canvas = activeViewer.get('canvas');
          if (canvas && canvas.zoom) {
            canvas.zoom('fit-viewport', 'auto');
          }
        }
      });
    } catch (error) {
      console.error('Failed to render DMN:', error);
    }

    return () => {
      // Clean up the viewer
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [xml]);

  return (
    <div 
      ref={containerRef} 
      className={`dmn-viewer ${className || ''}`}
      style={{ height: '500px', width: '100%' }}
    />
  );
};

export default DmnViewer;
