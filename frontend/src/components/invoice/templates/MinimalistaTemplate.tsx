import React from 'react';
import type { Invoice } from '../../../types/invoice';
import { InvoiceFooter } from '../InvoiceFooter';

interface MinimalistaTemplateProps {
  invoice: Invoice;
  logo?: string;
  format: 'ticket' | 'mediaCarta' | 'carta';
  footerText: string;
  headerColor?: string;
  borderColor?: string;
}

export const MinimalistaTemplate: React.FC<MinimalistaTemplateProps> = ({
  invoice,
  logo,
  format,
  footerText,
  headerColor = '#18181b',
  borderColor = '#e4e4e7'
}) => {
  if (format === 'ticket') {
    return null;
  }
  
  const containerClass = format === 'mediaCarta' 
    ? 'w-[396pt] max-w-[396pt] media-carta-format' 
    : 'w-[612pt] max-w-[612pt] carta-format';

  return (
    <div 
      className={`${containerClass} mx-auto bg-white p-8 md:p-12 shadow-2xl invoice-preview text-slate-900 font-sans rounded-2xl`}
      style={{ border: `1px solid ${borderColor}` }}
    >
      {/* Top Bar Label con Color Personalizado */}
      <div className="flex items-center justify-between pb-4 mb-8 border-b-2" style={{ borderColor: headerColor }}>
        <div className="flex items-center gap-3">
          {logo && <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />}
          <span className="text-xl font-black tracking-tight uppercase" style={{ color: headerColor }}>
            {invoice.emisor.nombre}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">DOCUMENTO FEL DTE</span>
          <span className="text-sm font-mono font-bold" style={{ color: headerColor }}>
            {invoice.serie} - {invoice.numero}
          </span>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b text-xs" style={{ borderColor }}>
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">EMISOR</span>
          <p className="font-bold text-sm text-slate-900">{invoice.emisor.nombre}</p>
          <p className="text-slate-600 font-mono">NIT: {invoice.emisor.nit}</p>
          <p className="text-slate-500 max-w-xs">{invoice.emisor.direccion}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">FACTURADO A</span>
          <p className="font-bold text-sm text-slate-900">{invoice.receptor.nombre}</p>
          <p className="text-slate-600 font-mono">NIT: {invoice.receptor.nit}</p>
          {invoice.receptor.direccion && (
            <p className="text-slate-500">{invoice.receptor.direccion}</p>
          )}
          <p className="text-slate-400 pt-1 font-mono">Fecha: {invoice.fecha}</p>
        </div>
      </div>

      {/* Table con Acentuación Dinámica */}
      <table className="w-full text-left border-collapse mb-8 text-xs">
        <thead>
          <tr className="border-b-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500" style={{ borderColor: headerColor }}>
            <th className="py-3">Descripción</th>
            <th className="py-3 text-center">Cant.</th>
            <th className="py-3 text-right">Precio Unitario</th>
            <th className="py-3 text-right">Importe Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoice.items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/50">
              <td className="py-3.5 font-medium text-slate-900">{item.descripcion}</td>
              <td className="py-3.5 text-center font-mono text-slate-700">{item.cantidad}</td>
              <td className="py-3.5 text-right font-mono text-slate-700">Q {item.precioUnitario.toFixed(2)}</td>
              <td className="py-3.5 text-right font-mono font-bold text-slate-900">Q {item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="pt-4 border-t-2 mb-8 flex justify-between items-center" style={{ borderColor: headerColor }}>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">MONEDA</span>
          <span className="text-xs font-semibold text-slate-700">Quetzales de Guatemala (GTQ)</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">TOTAL GENERAL</span>
          <span className="text-3xl font-black font-mono tracking-tight" style={{ color: headerColor }}>
            Q {invoice.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t" style={{ borderColor }}>
        <InvoiceFooter invoice={invoice} footerText={footerText} />
      </div>
    </div>
  );
};
