import React from 'react';
import type { Invoice } from '../../../types/invoice';
import { InvoiceFooter } from '../InvoiceFooter';

interface ModernaTemplateProps {
  invoice: Invoice;
  logo?: string;
  format: 'ticket' | 'mediaCarta' | 'carta';
  footerText: string;
  headerColor?: string;
  borderColor?: string;
}

export const ModernaTemplate: React.FC<ModernaTemplateProps> = ({
  invoice,
  logo,
  format,
  footerText,
  headerColor = '#111827',
  borderColor = '#e5e7eb'
}) => {
  if (format === 'ticket') {
    return null;
  }
  
  const containerClass = format === 'mediaCarta' 
    ? 'w-[396pt] max-w-[396pt] media-carta-format' 
    : 'w-[612pt] max-w-[612pt] carta-format';

  return (
    <div 
      className={`${containerClass} mx-auto bg-white p-8 md:p-10 shadow-2xl invoice-preview rounded-2xl text-slate-900 font-sans`}
      style={{ border: `1px solid ${borderColor}` }}
    >
      {/* Header Bloque Elegante con Color Personalizado */}
      <div 
        className="text-white p-8 rounded-2xl mb-8 shadow-xl"
        style={{ backgroundColor: headerColor }}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            {logo && (
              <div className="bg-white p-2 rounded-xl inline-block mb-2">
                <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
              </div>
            )}
            <h1 className="text-2xl font-black tracking-tight">{invoice.emisor.nombre}</h1>
            <p className="text-xs text-white/80 font-mono">NIT: {invoice.emisor.nit}</p>
            <p className="text-xs text-white/80 max-w-sm">{invoice.emisor.direccion}</p>
          </div>

          <div className="text-right bg-white/10 border border-white/20 p-4 rounded-xl min-w-[180px] backdrop-blur-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80 block mb-1">FACTURA FEL DTE</span>
            <p className="text-sm font-mono font-bold text-white">Serie: {invoice.serie}</p>
            <p className="text-sm font-mono font-bold text-white">No: {invoice.numero}</p>
            <p className="text-xs text-white/90 font-medium pt-2 mt-2 border-t border-white/20">{invoice.fecha}</p>
          </div>
        </div>
      </div>

      {/* Info Cliente & Certificador */}
      <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
        <div className="p-5 rounded-xl bg-slate-50 border" style={{ borderColor }}>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">CLIENTE</span>
          <h3 className="font-bold text-sm text-slate-900">{invoice.receptor.nombre}</h3>
          <p className="text-slate-600 font-mono">NIT: {invoice.receptor.nit}</p>
          {invoice.receptor.direccion && (
            <p className="text-slate-500 mt-1">{invoice.receptor.direccion}</p>
          )}
        </div>

        <div className="p-5 rounded-xl bg-slate-50 border" style={{ borderColor }}>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">AUTORIZACIÓN SAT</span>
          <p className="font-mono text-[11px] text-slate-700 break-all mb-1">
            <span className="text-slate-400 font-sans">Autorización:</span> {invoice.certificador.autorizacion || 'N/A'}
          </p>
          <p className="text-slate-600">Certificador: {invoice.certificador.nombre}</p>
          <p className="text-slate-500">NIT: {invoice.certificador.nit}</p>
        </div>
      </div>

      {/* Tabla Moderna Luxe con Header Dinámico */}
      <div className="border rounded-xl overflow-hidden mb-8" style={{ borderColor }}>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr 
              className="text-white text-[10px] font-extrabold uppercase tracking-wider"
              style={{ backgroundColor: headerColor }}
            >
              <th className="py-3.5 px-4">Descripción</th>
              <th className="py-3.5 px-4 text-center">Cantidad</th>
              <th className="py-3.5 px-4 text-right">Precio Unitario</th>
              <th className="py-3.5 px-4 text-right">Importe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="py-3.5 px-4 font-medium text-slate-900">{item.descripcion}</td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-700">{item.cantidad}</td>
                <td className="py-3.5 px-4 text-right font-mono text-slate-700">Q {item.precioUnitario.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">Q {item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen Total Destacado */}
      <div className="flex justify-end mb-8">
        <div 
          className="w-72 text-white rounded-xl p-5 space-y-2 text-xs shadow-lg"
          style={{ backgroundColor: headerColor }}
        >
          <div className="flex justify-between items-center text-white/80">
            <span>Subtotal</span>
            <span className="font-mono">Q {invoice.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-white/70">
            <span>Impuestos SAT (12%)</span>
            <span className="font-mono">Q {(invoice.total * 0.12).toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-white/20 flex justify-between items-baseline">
            <span className="font-extrabold uppercase text-white text-[11px] tracking-wider">TOTAL FINAL</span>
            <span className="text-2xl font-black font-mono text-white">Q {invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t" style={{ borderColor }}>
        <InvoiceFooter invoice={invoice} footerText={footerText} />
      </div>
    </div>
  );
};
