import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Invoice } from '../types/invoice';

export const exportInvoicesToZip = async (
  invoices: Invoice[],
  invoiceRefs: HTMLElement[],
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  if (invoices.length === 0) {
    throw new Error('No hay facturas para exportar');
  }

  const zip = new JSZip();
  const timestamp = new Date().toISOString().split('T')[0];

  const html2canvas = (await import('html2canvas')).default;
  const jsPDF = (await import('jspdf')).default;

  for (let i = 0; i < invoices.length; i++) {
    const invoice = invoices[i];
    const ref = invoiceRefs[i];

    if (ref && invoice) {
      try {
        // Asegurar que el elemento sea capturable por html2canvas
        const prevOpacity = ref.style.opacity;
        const prevDisplay = ref.style.display;
        ref.style.opacity = '1';
        ref.style.display = 'block';

        // Generar canvas del elemento
        const canvas = await html2canvas(ref, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: false,
          imageTimeout: 15000
        });

        // Restaurar opacidad
        ref.style.opacity = prevOpacity;
        ref.style.display = prevDisplay;

        if (canvas.width === 0 || canvas.height === 0) {
          console.warn(`Canvas vacío para factura ${invoice.numero}`);
          continue;
        }

        // Crear PDF en formato carta
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'letter'
        });

        const imgWidth = 612;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(792, imgHeight));
        
        const pdfBlob = pdf.output('blob');
        const fileName = `Factura-${invoice.serie}-${invoice.numero}.pdf`;
        
        zip.file(fileName, pdfBlob);

        if (onProgress) {
          onProgress(i + 1, invoices.length);
        }
      } catch (error) {
        console.error(`Error al procesar factura ${invoice.numero}:`, error);
      }
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `facturas-fel-${timestamp}.zip`);
};

export const exportSelectedToExcel = async (invoices: Invoice[]): Promise<void> => {
  const XLSX = await import('xlsx');
  
  const data = invoices.map(inv => ({
    'Serie': inv.serie,
    'Número': inv.numero,
    'Fecha': inv.fecha,
    'Emisor': inv.emisor.nombre,
    'NIT Emisor': inv.emisor.nit,
    'Receptor': inv.receptor.nombre,
    'NIT Receptor': inv.receptor.nit,
    'Total (GTQ)': inv.total,
    'Autorización (UUID)': inv.certificador.autorizacion
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Facturas');
  
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `facturas-fel-${timestamp}.xlsx`);
};

export const exportSelectedToJSON = (invoices: Invoice[]): void => {
  const timestamp = new Date().toISOString().split('T')[0];
  const dataStr = JSON.stringify(invoices, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  saveAs(blob, `facturas-fel-${timestamp}.json`);
};
