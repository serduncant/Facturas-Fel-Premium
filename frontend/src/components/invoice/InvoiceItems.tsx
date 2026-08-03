import React from 'react';
import type { Item } from '../../types/entities';
import { formatCurrency } from '../../utils/formatters';
import { numberToWords } from '../../utils/numberToWords';

interface InvoiceItemsProps {
  items: Item[];
  total: number;
  headerColor: string;
  borderColor: string;
}

export const InvoiceItems: React.FC<InvoiceItemsProps> = ({ 
  items, 
  total,
  headerColor,
  borderColor 
}) => (
  <div className="mb-6">
    <table className="w-full invoice-table" style={{ borderWidth: 2, borderColor }}>
      <thead>
        <tr style={{ backgroundColor: headerColor }}>
          <th className="py-2 px-3 text-center w-24 text-white" style={{ borderRight: `2px solid ${borderColor}` }}>CANTIDAD</th>
          <th className="py-2 px-3 text-center text-white" style={{ borderRight: `2px solid ${borderColor}` }}>DESCRIPCIÓN</th>
          <th className="py-2 px-3 text-center w-32 text-white" style={{ borderRight: `2px solid ${borderColor}` }}>P. UNITARIO</th>
          <th className="py-2 px-3 text-center w-32 text-white">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td className="py-2 px-3 text-center" style={{ borderRight: `1px solid ${borderColor}` }}>
              {item.cantidad}
            </td>
            <td className="py-2 px-3" style={{ borderRight: `1px solid ${borderColor}` }}>
              {item.descripcion}
            </td>
            <td className="py-2 px-3 text-right" style={{ borderRight: `1px solid ${borderColor}` }}>
              {formatCurrency(item.precioUnitario)}
            </td>
            <td className="py-2 px-3 text-right">
              {formatCurrency(item.total)}
            </td>
          </tr>
        ))}
        {Array.from({ length: Math.max(0, 5 - items.length) }).map((_, index) => (
          <tr key={`empty-${index}`}>
            <td className="py-2 px-3" style={{ borderRight: `1px solid ${borderColor}` }}>&nbsp;</td>
            <td className="py-2 px-3" style={{ borderRight: `1px solid ${borderColor}` }}>&nbsp;</td>
            <td className="py-2 px-3" style={{ borderRight: `1px solid ${borderColor}` }}>&nbsp;</td>
            <td className="py-2 px-3">&nbsp;</td>
          </tr>
        ))}
        <tr>
          <td colSpan={2} className="py-2 px-3" style={{ borderRight: `1px solid ${borderColor}`, borderTop: `2px solid ${borderColor}` }}>
            {numberToWords(total)}
          </td>
          <td className="py-2 px-3 text-right font-bold" style={{ borderRight: `1px solid ${borderColor}`, borderTop: `2px solid ${borderColor}` }}>
            TOTAL:
          </td>
          <td className="py-2 px-3 text-right font-bold" style={{ borderTop: `2px solid ${borderColor}` }}>
            {formatCurrency(total)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
