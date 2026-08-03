import React from 'react';
import { Palette, Type, Check, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsProps {
  borderColor: string;
  headerColor: string;
  onBorderColorChange: (color: string) => void;
  onHeaderColorChange: (color: string) => void;
  darkMode?: boolean;
}

export const Settings: React.FC<SettingsProps> = ({
  borderColor,
  headerColor,
  onBorderColorChange,
  onHeaderColorChange,
  darkMode = false
}) => {
  const presetPalettes = [
    { name: 'Slate Ejecutivo', header: '#0f172a', border: '#e2e8f0' },
    { name: 'Azul Corporativo', header: '#1e40af', border: '#cbd5e1' },
    { name: 'Negro Monocromo', header: '#18181b', border: '#e4e4e7' },
    { name: 'Azul Acero', header: '#1e293b', border: '#cbd5e1' },
    { name: 'Verde Esmeralda', header: '#065f46', border: '#a7f3d0' },
    { name: 'Púrpura Luxe', header: '#4c1d95', border: '#ddd6fe' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Controles de Color */}
        <div className="space-y-6">
          {/* Paletas Predeterminadas */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Paletas Recomendadas de Marca
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {presetPalettes.map((palette) => {
                const isActive = headerColor === palette.header && borderColor === palette.border;
                return (
                  <button
                    key={palette.name}
                    onClick={() => {
                      onHeaderColorChange(palette.header);
                      onBorderColorChange(palette.border);
                      toast.success(`Paleta "${palette.name}" aplicada`);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isActive 
                        ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-500/10' 
                        : darkMode 
                          ? 'border-slate-800 bg-slate-900 hover:border-slate-700' 
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold truncate mb-2">{palette.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: palette.header }} />
                      <div className="w-5 h-5 rounded-md border border-slate-300 shadow-sm" style={{ backgroundColor: palette.border }} />
                      {isActive && <Check className="w-4 h-4 text-blue-500 ml-auto" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color del Encabezado (Primario) */}
          <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-blue-500" />
              <label className="text-xs font-bold uppercase tracking-wider">
                Color de Encabezado / Primario
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={headerColor}
                onChange={(e) => onHeaderColorChange(e.target.value)}
                className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 bg-transparent shrink-0"
              />
              <input
                type="text"
                value={headerColor}
                onChange={(e) => onHeaderColorChange(e.target.value)}
                className={`flex-1 px-4 py-2 text-xs font-mono font-bold uppercase border rounded-xl ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
                placeholder="#0f172a"
              />
            </div>
          </div>

          {/* Color de los Bordes */}
          <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-indigo-500" />
              <label className="text-xs font-bold uppercase tracking-wider">
                Color de Bordes & Divisores
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={borderColor}
                onChange={(e) => onBorderColorChange(e.target.value)}
                className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 bg-transparent shrink-0"
              />
              <input
                type="text"
                value={borderColor}
                onChange={(e) => onBorderColorChange(e.target.value)}
                className={`flex-1 px-4 py-2 text-xs font-mono font-bold uppercase border rounded-xl ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
                placeholder="#e2e8f0"
              />
            </div>
          </div>

          {/* Botón de Restaurar */}
          <button
            onClick={() => {
              onHeaderColorChange('#0f172a');
              onBorderColorChange('#e2e8f0');
              toast.success('Valores predeterminados restaurados');
            }}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Valores Predeterminados</span>
          </button>
        </div>

        {/* Live Card Preview */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Vista Previa de Colores de Marca
          </label>

          <div 
            className="bg-white p-6 rounded-2xl shadow-xl text-slate-900 font-sans space-y-5"
            style={{ border: `1px solid ${borderColor}` }}
          >
            <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor }}>
              <div>
                <h4 className="font-extrabold text-base">MI EMPRESA, S.A.</h4>
                <p className="text-xs text-slate-500 font-mono">NIT: 12345678-9</p>
              </div>
              <div 
                className="px-3 py-2 rounded-xl text-white text-right font-mono text-xs font-bold"
                style={{ backgroundColor: headerColor }}
              >
                <p>FACTURA FEL</p>
                <p className="text-[10px] opacity-80">A-0012345</p>
              </div>
            </div>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-white text-[10px] uppercase font-bold" style={{ backgroundColor: headerColor }}>
                  <th className="py-2 px-3">Ítem</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor }}>
                <tr>
                  <td className="py-2 px-3 font-medium">Servicios Profesionales FEL</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">Q 150.00</td>
                </tr>
              </tbody>
            </table>

            <div className="p-3 rounded-xl text-white text-right space-y-0.5" style={{ backgroundColor: headerColor }}>
              <span className="text-[10px] uppercase tracking-wider block opacity-80">Total General</span>
              <span className="text-xl font-black font-mono">Q 150.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
