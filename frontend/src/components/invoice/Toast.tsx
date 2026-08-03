import React from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    warning: <AlertTriangle className="text-yellow-500" size={20} />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${bgColors[type]} shadow-lg`}>
      {icons[type]}
      <span className="flex-1 text-sm font-medium text-gray-800">{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  );
};
