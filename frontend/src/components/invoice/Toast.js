import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
export const Toast = ({ type, message, onClose }) => {
    const icons = {
        success: _jsx(CheckCircle, { className: "text-green-500", size: 20 }),
        error: _jsx(XCircle, { className: "text-red-500", size: 20 }),
        info: _jsx(Info, { className: "text-blue-500", size: 20 }),
        warning: _jsx(AlertTriangle, { className: "text-yellow-500", size: 20 })
    };
    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-yellow-50 border-yellow-200'
    };
    return (_jsxs("div", { className: `flex items-center gap-3 p-4 rounded-lg border ${bgColors[type]} shadow-lg`, children: [icons[type], _jsx("span", { className: "flex-1 text-sm font-medium text-gray-800", children: message }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600", children: "\u00D7" })] }));
};
