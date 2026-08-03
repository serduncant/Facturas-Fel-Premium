import React from 'react';
import type { Emisor } from '../../types/entities';

interface InvoiceHeaderProps {
  emisor: Emisor;
  numero: string;
  serie: string;
  fecha: string;
  logo?: string;
  borderColor: string;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  emisor,
  numero,
  serie,
  fecha,
  logo,
  borderColor
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-start gap-4">
        {logo ? (
          <img src={logo} alt="Logo empresa" className="h-24 object-contain" />
        ) : (
          <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded">
            <span className="text-gray-400">Logo</span>
          </div>
        )}
      </div>
      <div className="text-center flex-grow">
        <h1 className="text-2xl font-bold uppercase mb-2">{emisor.nombre}</h1>
        <p className="font-semibold">NIT: {emisor.nit}</p>
        <p className="text-sm mt-1">{emisor.direccion}</p>
      </div>
      <div className="min-w-[200px]">
        <div className="border-2 p-3" style={{ borderColor }}>
          <p className="text-sm font-bold mb-2">FACTURA PEQUEÑO CONTRIBUYENTE</p>
          <p className="text-sm mb-1">No. {numero}</p>
          <p className="text-sm">Serie: {serie}</p>
        </div>
      </div>
    </div>
    
    <div className="flex justify-end">
      <div className="border-2 px-4 py-2" style={{ borderColor }}>
        <p className="text-sm font-bold">FECHA: {fecha}</p>
      </div>
    </div>
  </div>
);
