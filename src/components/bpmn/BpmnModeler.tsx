
import React, { useRef, useEffect, useState, useCallback } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import {
  Save,
  Download,
  Upload,
  FileUpload,
  FilePlus,
  Undo,
  Redo,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Empty BPMN template
const emptyBpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

interface BpmnModelerProps {
  initialXml?: string;
  onSave?: (xml: string) => void;
}

const BpmnModeler: React.FC<BpmnModelerProps> = ({ 
  initialXml = emptyBpmn, 
  onSave 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const propertiesPanelRef = useRef<HTMLDivElement>(null);
  const bpmnModelerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize BPMN modeler
  const initBpmnModeler = useCallback(() => {
    if (containerRef.current && propertiesPanelRef.current) {
      // Clean up existing modeler if it exists
      if (bpmnModelerRef.current) {
        bpmnModelerRef.current.destroy();
        bpmnModelerRef.current = null;
      }

      // Create new modeler instance
      const modeler = new BpmnJS({
        container: containerRef.current,
        propertiesPanel: {
          parent: propertiesPanelRef.current
        },
        additionalModules: [
          propertiesPanelModule,
          propertiesProviderModule
        ],
        keyboard: {
          bindTo: document
        }
      });

      bpmnModelerRef.current = modeler;

      // Import XML
      modeler.importXML(initialXml)
        .then(({ warnings }) => {
          if (warnings.length) {
            console.warn('BPMN import warnings:', warnings);
          }
          
          const canvas = modeler.get('canvas');
          canvas.zoom('fit-viewport', 'auto');
          
          setIsLoaded(true);
        })
        .catch((err) => {
          console.error('BPMN import error:', err);
          toast.error('Failed to load BPMN diagram');
        });
    }
  }, [initialXml]);

  useEffect(() => {
    initBpmnModeler();

    return () => {
      // Clean up on component unmount
      if (bpmnModelerRef.current) {
        bpmnModelerRef.current.destroy();
        bpmnModelerRef.current = null;
      }
    };
  }, [initBpmnModeler]);

  // Toggle view mode
  useEffect(() => {
    if (!bpmnModelerRef.current || !isLoaded) return;

    const canvas = bpmnModelerRef.current.get('canvas');
    const eventBus = bpmnModelerRef.current.get('eventBus');
    
    if (isViewOnly) {
      // Disable interactions
      canvas.hideLayer('controls');
      
      // Disable direct editing
      eventBus.on('directEditing.activate', (event) => {
        event.preventDefault();
        return false;
      });
    } else {
      // Enable interactions
      canvas.showLayer('controls');
      
      // Re-enable direct editing by re-importing the XML
      bpmnModelerRef.current.saveXML({ format: true })
        .then(({ xml }) => {
          bpmnModelerRef.current.importXML(xml);
        });
    }
  }, [isViewOnly, isLoaded]);

  // Handle undo
  const handleUndo = () => {
    if (!bpmnModelerRef.current) return;
    try {
      bpmnModelerRef.current.get('commandStack').undo();
    } catch (err) {
      console.error('Undo error:', err);
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (!bpmnModelerRef.current) return;
    try {
      bpmnModelerRef.current.get('commandStack').redo();
    } catch (err) {
      console.error('Redo error:', err);
    }
  };

  // Handle new diagram
  const handleNew = () => {
    if (window.confirm('Are you sure you want to create a new diagram? Any unsaved changes will be lost.')) {
      if (!bpmnModelerRef.current) return;
      
      bpmnModelerRef.current.importXML(emptyBpmn)
        .then(() => {
          toast.success('New diagram created');
        })
        .catch((err) => {
          console.error('Error creating new diagram:', err);
          toast.error('Failed to create new diagram');
        });
    }
  };

  // Handle save
  const handleSave = () => {
    if (!bpmnModelerRef.current) return;
    
    bpmnModelerRef.current.saveXML({ format: true })
      .then(({ xml }) => {
        if (onSave) {
          onSave(xml);
        }
        toast.success('Diagram saved');
      })
      .catch((err) => {
        console.error('Save error:', err);
        toast.error('Failed to save diagram');
      });
  };

  // Handle export
  const handleExport = (format: 'xml' | 'svg' | 'png') => {
    if (!bpmnModelerRef.current) return;
    
    try {
      if (format === 'xml') {
        bpmnModelerRef.current.saveXML({ format: true })
          .then(({ xml }) => {
            downloadFile(xml, 'diagram.bpmn', 'application/xml');
            toast.success('BPMN file downloaded');
          })
          .catch((err) => {
            console.error('XML export error:', err);
            toast.error('Failed to export diagram');
          });
      } else if (format === 'svg') {
        bpmnModelerRef.current.saveSVG()
          .then(({ svg }) => {
            downloadFile(svg, 'diagram.svg', 'image/svg+xml');
            toast.success('SVG diagram downloaded');
          })
          .catch((err) => {
            console.error('SVG export error:', err);
            toast.error('Failed to export diagram');
          });
      } else {
        // For PNG, we use saveSVG and convert it
        bpmnModelerRef.current.saveSVG()
          .then(({ svg }) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              
              const dataUrl = canvas.toDataURL('image/png');
              downloadFile(dataUrl, 'diagram.png', 'image/png');
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

  // Handle file upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !bpmnModelerRef.current) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const xml = e.target?.result as string;
      
      bpmnModelerRef.current.importXML(xml)
        .then(() => {
          toast.success('Diagram imported successfully');
          setIsUploadDialogOpen(false);
          
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        })
        .catch((err) => {
          console.error('Import error:', err);
          toast.error('Failed to import diagram. Please check the file format.');
        });
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
    };

    reader.readAsText(file);
  };

  // Handle drag and drop
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    event.currentTarget.classList.add('border-primary-500');
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-primary-500');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-primary-500');

    if (!bpmnModelerRef.current) return;

    const file = event.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const xml = e.target?.result as string;
      
      bpmnModelerRef.current.importXML(xml)
        .then(() => {
          toast.success('Diagram imported successfully');
          setIsUploadDialogOpen(false);
        })
        .catch((err) => {
          console.error('Import error:', err);
          toast.error('Failed to import diagram. Please check the file format.');
        });
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleNew} className="btn-hover-glow">
            <FilePlus className="w-4 h-4 mr-2" />
            New
          </Button>
          <Button variant="outline" onClick={handleSave} className="btn-hover-glow">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="btn-hover-glow">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('xml')}>
                BPMN XML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('svg')}>
                SVG Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('png')}>
                PNG Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="btn-hover-glow">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import BPMN Diagram</DialogTitle>
              </DialogHeader>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileUpload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-4 mb-2 text-gray-600">Drag and drop a BPMN file here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <div className="flex justify-center">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="default" onClick={() => fileInputRef.current?.click()}>
                      Browse Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".bpmn,.xml"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            className="hover:bg-gray-100"
            title="Undo"
          >
            <Undo className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRedo}
            className="hover:bg-gray-100"
            title="Redo"
          >
            <Redo className="w-5 h-5" />
          </Button>
          <div className="flex items-center ml-4 space-x-2">
            <Switch
              id="preview-mode"
              checked={isViewOnly}
              onCheckedChange={setIsViewOnly}
            />
            <Label htmlFor="preview-mode" className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              Preview Mode
            </Label>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden rounded-lg shadow-lg border border-gray-200">
        <div
          ref={containerRef}
          className="flex-1 bg-white bg-gradient-to-br from-gray-50 to-white"
        ></div>
        
        <div
          ref={propertiesPanelRef}
          className={`w-80 transition-all duration-500 ease-in-out overflow-auto border-l border-gray-200 bg-white ${isViewOnly ? 'hidden' : ''}`}
        ></div>
      </div>
    </div>
  );
};

export default BpmnModeler;
