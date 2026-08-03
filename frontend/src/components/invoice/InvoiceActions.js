import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Printer, Download, FileJson, FileSpreadsheet } from 'lucide-react';
export const InvoiceActions = ({ onPrint, onSavePDF, onExportJSON, onExportExcel, darkMode = false }) => {
    const buttonClass = `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${darkMode
        ? 'bg-gray-700 text-white hover:bg-gray-600'
        : 'bg-white border border-gray-300 hover:bg-gray-50'}`;
    return (_jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("button", { onClick: onPrint, className: buttonClass, title: "Imprimir", children: [_jsx(Printer, { size: 18 }), _jsx("span", { className: "hidden sm:inline", children: "Imprimir" })] }), _jsxs("button", { onClick: onSavePDF, className: buttonClass, title: "Guardar como PDF", children: [_jsx(Download, { size: 18 }), _jsx("span", { className: "hidden sm:inline", children: "PDF" })] }), _jsxs("button", { onClick: onExportJSON, className: buttonClass, title: "Exportar a JSON", children: [_jsx(FileJson, { size: 18 }), _jsx("span", { className: "hidden sm:inline", children: "JSON" })] }), _jsxs("button", { onClick: onExportExcel, className: buttonClass, title: "Exportar a Excel", children: [_jsx(FileSpreadsheet, { size: 18 }), _jsx("span", { className: "hidden sm:inline", children: "Excel" })] })] }));
};
