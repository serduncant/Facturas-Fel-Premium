import React, { useState, useRef } from 'react';
import type { Invoice } from '../../types/invoice';
import { X, Search, Calendar, DollarSign, FileText, Table, Code, CheckSquare, Square } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { exportInvoicesToZip, exportSelectedToExcel, exportSelectedToJSON } from '../../utils/bulkExport';
import { InvoicePreview } from './InvoicePreview';
import toast from 'react-hot-toast';

interface InvoiceHistoryProps {
  invoices: Invoice[];
  onSelect: (invoice: Invoice) => void;
  onClose: () => void;
  darkMode: boolean;
  userPlan: 'free' | 'basic' | 'premium' | 'enterprise';
}

export const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({
  invoices,
  onSelect,
  onClose,
  darkMode,
  userPlan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<Set<number>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  
  const previewRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isPremium = userPlan === 'premium' || userPlan === 'enterprise';

  const filteredInvoices = invoices.filter(inv =>
    inv.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.receptor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.receptor.nit.includes(searchTerm)
  );

  const toggleSelection = (index: number) => {
    if (!isPremium) {
      toast.error('Exportación masiva disponible en planes Premium y Enterprise', {
        duration: 4000,
        icon: '🔒'
      });
      return;
    }

    const newSelected = new Set(selectedInvoices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedInvoices(newSelected);
  };

  const toggleSelectAll = () => {
    if (!isPremium) {
      toast.error('Exportación masiva disponible en planes Premium y Enterprise', {
        duration: 4000,
        icon: '🔒'
      });
      return;
    }

    if (selectedInvoices.size === filteredInvoices.length) {
      setSelectedInvoices(new Set());
    } else {
      const allIndices = filteredInvoices.map((_, idx) => idx);
      setSelectedInvoices(new Set(allIndices));
    }
  };

  const handleExportPDFs = async () => {
    if (!isPremium) {
      toast.error('Exportación masiva disponible en planes Premium y Enterprise', {
        duration: 4000,
        icon: '🔒'
      });
      return;
    }

    if (selectedInvoices.size === 0) {
      toast.error('Selecciona al menos una factura');
      return;
    }

    setIsExporting(true);
    setExportProgress({ current: 0, total: selectedInvoices.size });

    try {
      const selectedInvs = Array.from(selectedInvoices)
        .map(idx => filteredInvoices[idx])
        .filter(inv => inv != null);

      const selectedRefs = Array.from(selectedInvoices)
        .map(idx => previewRefs.current[idx])
        .filter(ref => ref != null) as HTMLElement[];

      await exportInvoicesToZip(selectedInvs, selectedRefs, (current: number, total: number) => {
        setExportProgress({ current, total });
      });

      toast.success(`${selectedInvoices.size} facturas exportadas exitosamente`);
      setSelectedInvoices(new Set());
    } catch (error) {
      console.error('Error exporting PDFs:', error);
      toast.error('Error al exportar facturas');
    } finally {
      setIsExporting(false);
      setExportProgress({ current: 0, total: 0 });
    }
  };

  const handleExportExcel = async () => {
    if (!isPremium) {
      toast.error('Exportación masiva disponible en planes Premium y Enterprise', {
        duration: 4000,
        icon: '🔒'
      });
      return;
    }

    if (selectedInvoices.size === 0) {
      toast.error('Selecciona al menos una factura');
      return;
    }

    try {
      const selectedInvs = Array.from(selectedInvoices)
        .map(idx => filteredInvoices[idx])
        .filter(inv => inv != null);

      await exportSelectedToExcel(selectedInvs);
      toast.success(`${selectedInvoices.size} facturas exportadas a Excel`);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Error al exportar a Excel');
    }
  };

  const handleExportJSON = () => {
    if (!isPremium) {
      toast.error('Exportación masiva disponible en planes Premium y Enterprise', {
        duration: 4000,
        icon: '🔒'
      });
      return;
    }

    if (selectedInvoices.size === 0) {
      toast.error('Selecciona al menos una factura');
      return;
    }

    try {
      const selectedInvs = Array.from(selectedInvoices)
        .map(idx => filteredInvoices[idx])
        .filter(inv => inv != null);

      exportSelectedToJSON(selectedInvs);
      toast.success(`${selectedInvoices.size} facturas exportadas a JSON`);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast.error('Error al exportar a JSON');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col`}>
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Historial de Facturas ({invoices.length})
            </h2>
            {selectedInvoices.size > 0 && (
              <p className={`text-sm mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {selectedInvoices.size} seleccionada{selectedInvoices.size > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={24} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>

        {isPremium && (
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <button
                onClick={toggleSelectAll}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                {selectedInvoices.size === filteredInvoices.length ? <CheckSquare size={16} /> : <Square size={16} />}
                {selectedInvoices.size === filteredInvoices.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </button>

              {selectedInvoices.size > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleExportPDFs}
                    disabled={isExporting}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <FileText size={16} />
                    {isExporting ? `Exportando ${exportProgress.current}/${exportProgress.total}...` : 'PDF (ZIP)'}
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <Table size={16} />
                    Excel
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <Code size={16} />
                    JSON
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por número, serie, receptor o NIT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredInvoices.length === 0 ? (
              <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {searchTerm ? 'No se encontraron facturas' : 'No hay facturas en el historial'}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredInvoices.map((inv, index) => (
                  <div key={index}>
                    <div
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedInvoices.has(index)
                          ? darkMode
                            ? 'bg-blue-900 border-blue-600 shadow-lg'
                            : 'bg-blue-50 border-blue-400 shadow-lg'
                          : darkMode 
                            ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        {isPremium && (
                          <div className="pt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelection(index);
                              }}
                              className="p-1 hover:bg-gray-500/20 rounded transition-colors"
                            >
                              {selectedInvoices.has(index) ? (
                                <CheckSquare size={20} className="text-blue-500" />
                              ) : (
                                <Square size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                              )}
                            </button>
                          </div>
                        )}
                        
                        <div 
                          className="flex-1"
                          onClick={() => onSelect(inv)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {inv.serie} - {inv.numero}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                                  FEL
                                </span>
                              </div>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {inv.receptor.nombre}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                NIT: {inv.receptor.nit}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                                <span className="text-xs font-mono font-bold">Q.</span>
                                <span>{formatCurrency(inv.total)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar size={12} />
                                <span>{inv.fecha}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vista previa para generar PDFs masivos */}
                    {selectedInvoices.has(index) && (
                      <div style={{ position: 'fixed', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -100, width: '612pt' }}>
                        <div ref={(el) => { if (el) previewRefs.current[index] = el; }}>
                          <InvoicePreview
                            invoice={inv}
                            format="carta"
                            footerText="¡Gracias por su compra!"
                            headerColor="#0f172a"
                            borderColor="#e2e8f0"
                            template="clasica"
                          />
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!isPremium && (
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-blue-50'}`}>
            <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              🔒 Exportación masiva disponible en planes <span className="font-bold text-blue-600">Premium</span> y <span className="font-bold text-pink-600">Enterprise</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
