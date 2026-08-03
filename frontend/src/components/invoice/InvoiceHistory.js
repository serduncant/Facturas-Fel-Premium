import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { X, Search, Calendar, FileText, Table, Code, CheckSquare, Square } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { exportInvoicesToZip, exportSelectedToExcel, exportSelectedToJSON } from '../../utils/bulkExport';
import { InvoicePreview } from './InvoicePreview';
import toast from 'react-hot-toast';
export const InvoiceHistory = ({ invoices, onSelect, onClose, darkMode, userPlan }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoices, setSelectedInvoices] = useState(new Set());
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
    const previewRefs = useRef([]);
    const isPremium = userPlan === 'premium' || userPlan === 'enterprise';
    const filteredInvoices = invoices.filter(inv => inv.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.receptor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.receptor.nit.includes(searchTerm));
    const toggleSelection = (index) => {
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
        }
        else {
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
        }
        else {
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
                .filter(ref => ref != null);
            await exportInvoicesToZip(selectedInvs, selectedRefs, (current, total) => {
                setExportProgress({ current, total });
            });
            toast.success(`${selectedInvoices.size} facturas exportadas exitosamente`);
            setSelectedInvoices(new Set());
        }
        catch (error) {
            console.error('Error exporting PDFs:', error);
            toast.error('Error al exportar facturas');
        }
        finally {
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('Error exporting JSON:', error);
            toast.error('Error al exportar a JSON');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col`, children: [_jsxs("div", { className: `flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`, children: [_jsxs("div", { children: [_jsxs("h2", { className: `text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`, children: ["Historial de Facturas (", invoices.length, ")"] }), selectedInvoices.size > 0 && (_jsxs("p", { className: `text-sm mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`, children: [selectedInvoices.size, " seleccionada", selectedInvoices.size > 1 ? 's' : ''] }))] }), _jsx("button", { onClick: onClose, className: `p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`, children: _jsx(X, { size: 24, className: darkMode ? 'text-gray-300' : 'text-gray-600' }) })] }), isPremium && (_jsx("div", { className: `p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`, children: _jsxs("div", { className: "flex flex-wrap gap-2 items-center justify-between", children: [_jsxs("button", { onClick: toggleSelectAll, className: `px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${darkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'}`, children: [selectedInvoices.size === filteredInvoices.length ? _jsx(CheckSquare, { size: 16 }) : _jsx(Square, { size: 16 }), selectedInvoices.size === filteredInvoices.length ? 'Deseleccionar todo' : 'Seleccionar todo'] }), selectedInvoices.size > 0 && (_jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: handleExportPDFs, disabled: isExporting, className: "px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50", children: [_jsx(FileText, { size: 16 }), isExporting ? `Exportando ${exportProgress.current}/${exportProgress.total}...` : 'PDF (ZIP)'] }), _jsxs("button", { onClick: handleExportExcel, className: "px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors", children: [_jsx(Table, { size: 16 }), "Excel"] }), _jsxs("button", { onClick: handleExportJSON, className: "px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors", children: [_jsx(Code, { size: 16 }), "JSON"] })] }))] }) })), _jsxs("div", { className: "p-6 flex-1 overflow-hidden flex flex-col", children: [_jsxs("div", { className: "relative mb-4", children: [_jsx(Search, { className: "absolute left-3 top-3 text-gray-400", size: 20 }), _jsx("input", { type: "text", placeholder: "Buscar por n\u00FAmero, serie, receptor o NIT...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: `w-full pl-10 pr-4 py-2 border rounded-lg ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900'}` })] }), _jsx("div", { className: "overflow-y-auto flex-1", children: filteredInvoices.length === 0 ? (_jsx("p", { className: `text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`, children: searchTerm ? 'No se encontraron facturas' : 'No hay facturas en el historial' })) : (_jsx("div", { className: "space-y-3", children: filteredInvoices.map((inv, index) => (_jsxs("div", { children: [_jsx("div", { className: `p-4 rounded-lg border cursor-pointer transition-all ${selectedInvoices.has(index)
                                                ? darkMode
                                                    ? 'bg-blue-900 border-blue-600 shadow-lg'
                                                    : 'bg-blue-50 border-blue-400 shadow-lg'
                                                : darkMode
                                                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`, children: _jsxs("div", { className: "flex gap-3 items-start", children: [isPremium && (_jsx("div", { className: "pt-1", children: _jsx("button", { onClick: (e) => {
                                                                e.stopPropagation();
                                                                toggleSelection(index);
                                                            }, className: "p-1 hover:bg-gray-500/20 rounded transition-colors", children: selectedInvoices.has(index) ? (_jsx(CheckSquare, { size: 20, className: "text-blue-500" })) : (_jsx(Square, { size: 20, className: darkMode ? 'text-gray-400' : 'text-gray-500' })) }) })), _jsx("div", { className: "flex-1", onClick: () => onSelect(inv), children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsxs("span", { className: `font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`, children: [inv.serie, " - ", inv.numero] }), _jsx("span", { className: `text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`, children: "FEL" })] }), _jsx("p", { className: `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`, children: inv.receptor.nombre }), _jsxs("p", { className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`, children: ["NIT: ", inv.receptor.nit] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold mb-2", children: [_jsx("span", { className: "text-xs font-mono font-bold", children: "Q." }), _jsx("span", { children: formatCurrency(inv.total) })] }), _jsxs("div", { className: "flex items-center gap-1 text-xs text-gray-500", children: [_jsx(Calendar, { size: 12 }), _jsx("span", { children: inv.fecha })] })] })] }) })] }) }), selectedInvoices.has(index) && (_jsx("div", { style: { position: 'fixed', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -100, width: '612pt' }, children: _jsx("div", { ref: (el) => { if (el)
                                                    previewRefs.current[index] = el; }, children: _jsx(InvoicePreview, { invoice: inv, format: "carta", footerText: "\u00A1Gracias por su compra!", headerColor: "#0f172a", borderColor: "#e2e8f0", template: "clasica" }) }) }))] }, index))) })) })] }), !isPremium && (_jsx("div", { className: `p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-blue-50'}`, children: _jsxs("p", { className: `text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: ["\uD83D\uDD12 Exportaci\u00F3n masiva disponible en planes ", _jsx("span", { className: "font-bold text-blue-600", children: "Premium" }), " y ", _jsx("span", { className: "font-bold text-pink-600", children: "Enterprise" })] }) }))] }) }));
};
