import React from 'react';
import { Receipt, FileText, Newspaper } from 'lucide-react';

interface FormatSelectorProps {
  format: 'ticket' | 'mediaCarta' | 'carta';
  onFormatChange: (format: 'ticket' | 'mediaCarta' | 'carta') => void;
  darkMode?: boolean;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ 
  format, 
  onFormatChange,
  darkMode = false 
}) => {
  const formats = [
    { value: 'ticket' as const, label: 'Ticket', icon: Receipt, width: '80mm' },
    { value: 'mediaCarta' as const, label: 'Media Carta', icon: FileText, width: '5.5"' },
    { value: 'carta' as const, label: 'Carta', icon: Newspaper, width: '8.5"' }
  ];

  return (
    <div className="flex gap-2">
      {formats.map(({ value, label, icon: Icon, width }) => (
        <button
          key={value}
          onClick={() => onFormatChange(value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            format === value
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Icon size={18} />
          <div className="text-left">
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs opacity-75">{width}</div>
          </div>
        </button>
      ))}
    </div>
  );
};
