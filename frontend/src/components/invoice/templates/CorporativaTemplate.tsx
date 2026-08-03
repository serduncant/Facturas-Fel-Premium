import React from 'react';
import type { Invoice } from '../../../types/invoice';
import { InvoiceFooter } from '../InvoiceFooter';

interface CorporativaTemplateProps {
  invoice: Invoice;
  logo?: string;
  format: 'ticket' | 'mediaCarta' | 'carta';
  footerText: string;
  headerColor?: string;
  borderColor?: string;
}

export const CorporativaTemplate: React.FC<CorporativaTemplateProps> = ({
  invoice,
  logo,
  format,
  footerText,
  headerColor = '#0f172a',
  borderColor = '#e2e8f0'
}) => {
  if (format === 'ticket') {
    return null;
  }
  
  const containerClass = format === 'mediaCarta' 
    ? 'w-[396pt] max-w-[396pt] media-carta-format' 
    : 'w-[612pt] max-w-[612pt] carta-format';

  return (
    <div 
      className={`${containerClass} mx-auto bg-white p-8 md:p-10 shadow-2xl print:shadow-none print:border-0 print:rounded-none invoice-preview rounded-xl text-slate-900 font-sans`}
      style={{ border: `1px solid ${borderColor}` }}
    >
      {/* Header Corporativo Elegante con Color Personalizable */}
      <div className="flex justify-between items-start border-b pb-8 mb-8" style={{ borderColor }}>
        <div className="flex items-start gap-5">
          {logo && (
            <div className="p-2 border rounded-xl bg-white shrink-0" style={{ borderColor }}>
              <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />
            </div>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{invoice.emisor.nombre}</h1>
            <p className="text-xs font-semibold text-slate-500">NIT: {invoice.emisor.nit}</p>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">{invoice.emisor.direccion}</p>
          </div>
        </div>

        {/* Badge Factura FEL DTE con Color de Encabezado */}
        <div 
          className="text-right space-y-1.5 text-white p-4 rounded-xl shadow-md min-w-[200px]"
          style={{ backgroundColor: headerColor }}
        >
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/80 block">FACTURA ELECTRÓNICA</span>
          <div className="text-xs font-mono font-bold text-white">
            <p><span className="text-white/70 font-normal">Serie:</span> {invoice.serie}</p>
            <p><span className="text-white/70 font-normal">No:</span> {invoice.numero}</p>
          </div>
          <p className="text-[11px] text-white/90 font-medium pt-1 border-t border-white/20">{invoice.fecha}</p>
        </div>
      </div>

      {/* Info de la Factura y del Cliente */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50/80 p-5 rounded-xl border space-y-1" style={{ borderColor }}>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">FACTURADO A</span>
          <h3 className="font-bold text-sm text-slate-900">{invoice.receptor.nombre}</h3>
          <p className="text-xs font-medium text-slate-600">NIT: {invoice.receptor.nit}</p>
          {invoice.receptor.direccion && (
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{invoice.receptor.direccion}</p>
          )}
        </div>

        <div className="bg-slate-50/80 p-5 rounded-xl border space-y-1" style={{ borderColor }}>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">DATOS DE AUTORIZACIÓN (SAT DTE)</span>
          <p className="text-[11px] font-mono text-slate-700 break-all">
            <span className="text-slate-500 font-sans">UUID:</span> {invoice.certificador.autorizacion || 'N/A'}
          </p>
          <p className="text-xs text-slate-600">Certificador: {invoice.certificador.nombre}</p>
          <p className="text-xs text-slate-500">NIT Certificador: {invoice.certificador.nit}</p>
        </div>
      </div>

      {/* Tabla de Productos con Color Personalizado */}
      <div className="border rounded-xl overflow-hidden mb-8" style={{ borderColor }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr 
              className="text-white text-[11px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: headerColor }}
            >
              <th className="py-3.5 px-4">Descripción</th>
              <th className="py-3.5 px-4 text-center">Cant.</th>
              <th className="py-3.5 px-4 text-right">Precio Unitario</th>
              <th className="py-3.5 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs" style={{ borderColor }}>
            {invoice.items.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="py-3.5 px-4 font-medium text-slate-900">{item.descripcion}</td>
                <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-700">{item.cantidad}</td>
                <td className="py-3.5 px-4 text-right font-mono text-slate-700">Q {item.precioUnitario.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">Q {item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen del Total */}
      <div className="flex justify-end mb-8">
        <div 
          className="w-72 text-white rounded-xl p-5 shadow-lg space-y-3"
          style={{ backgroundColor: headerColor }}
        >
          <div className="flex justify-between items-center text-xs text-white/80">
            <span>Subtotal</span>
            <span className="font-mono">Q {invoice.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-white/70">
            <span>IVA Incluido (12%)</span>
            <span className="font-mono">Q {(invoice.total * 0.12).toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-white/20 flex justify-between items-baseline">
            <span className="text-xs font-bold uppercase tracking-wider text-white">TOTAL A PAGAR</span>
            <span className="text-2xl font-black font-mono text-white">Q {invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer SAT */}
      <div className="pt-6 border-t" style={{ borderColor }}>
        <InvoiceFooter invoice={invoice} footerText={footerText} />
      </div>
    </div>
  );
};
