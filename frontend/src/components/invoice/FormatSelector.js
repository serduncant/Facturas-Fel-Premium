import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Receipt, FileText, Newspaper } from 'lucide-react';
export const FormatSelector = ({ format, onFormatChange, darkMode = false }) => {
    const formats = [
        { value: 'ticket', label: 'Ticket', icon: Receipt, width: '80mm' },
        { value: 'mediaCarta', label: 'Media Carta', icon: FileText, width: '5.5"' },
        { value: 'carta', label: 'Carta', icon: Newspaper, width: '8.5"' }
    ];
    return (_jsx("div", { className: "flex gap-2", children: formats.map(({ value, label, icon: Icon, width }) => (_jsxs("button", { onClick: () => onFormatChange(value), className: `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${format === value
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'}`, children: [_jsx(Icon, { size: 18 }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "text-sm font-medium", children: label }), _jsx("div", { className: "text-xs opacity-75", children: width })] })] }, value))) }));
};
