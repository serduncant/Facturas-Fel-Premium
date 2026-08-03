import React from 'react';
import { Printer, Download, FileJson, FileSpreadsheet } from 'lucide-react';

interface InvoiceActionsProps {
  onPrint: () => void;
  onSavePDF: () => void;
  onExportJSON: () => void;
  onExportExcel: () => void;
  darkMode?: boolean;
}

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  onPrint,
  onSavePDF,
  onExportJSON,
  onExportExcel,
  darkMode = false
}) => {
  const buttonClass = `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
    darkMode 
      ? 'bg-gray-700 text-white hover:bg-gray-600' 
      : 'bg-white border border-gray-300 hover:bg-gray-50'
  }`;

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={onPrint} className={buttonClass} title="Imprimir">
        <Printer size={18} />
        <span className="hidden sm:inline">Imprimir</span>
      </button>
      
      <button onClick={onSavePDF} className={buttonClass} title="Guardar como PDF">
        <Download size={18} />
        <span className="hidden sm:inline">PDF</span>
      </button>
      
      <button onClick={onExportJSON} className={buttonClass} title="Exportar a JSON">
        <FileJson size={18} />
        <span className="hidden sm:inline">JSON</span>
      </button>
      
      <button onClick={onExportExcel} className={buttonClass} title="Exportar a Excel">
        <FileSpreadsheet size={18} />
        <span className="hidden sm:inline">Excel</span>
      </button>
    </div>
  );
};
