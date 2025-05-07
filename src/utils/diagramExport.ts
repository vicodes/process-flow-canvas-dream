
import { toast } from 'sonner';
import BpmnJS from 'bpmn-js';

export const exportDiagram = (
  bpmnViewer: BpmnJS | null,
  format: 'svg' | 'png'
) => {
  if (!bpmnViewer) return;
  
  try {
    if (format === 'svg') {
      bpmnViewer.saveSVG()
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
      bpmnViewer.saveSVG()
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

export const downloadFile = (content: string, fileName: string, contentType: string) => {
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
