import React from 'react';
import type { Invoice } from '../../types/invoice';
import type { InvoiceTemplate } from '../../types/templates';
import { InvoiceHeader } from './InvoiceHeader';
import { ClientInfo } from './ClientInfo';
import { InvoiceItems } from './InvoiceItems';
import { InvoiceFooter } from './InvoiceFooter';
import { ModernaTemplate } from './templates/ModernaTemplate';
import { MinimalistaTemplate } from './templates/MinimalistaTemplate';
import { CorporativaTemplate } from './templates/CorporativaTemplate';

interface InvoicePreviewProps {
  invoice: Invoice;
  logo?: string;
  format: 'ticket' | 'mediaCarta' | 'carta';
  footerText: string;
  headerColor: string;
  borderColor: string;
  template?: InvoiceTemplate;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  logo,
  format,
  footerText,
  headerColor,
  borderColor,
  template = 'clasica'
}) => {
  // IMPORTANTE: Formato ticket siempre usa plantilla clásica
  const useClassicTemplate = template === 'clasica';

  // Renderizar plantilla ticket (clásica)
  if (format === 'ticket') {
    return (
      <div className="w-full max-w-[216px] mx-auto bg-white p-4 shadow-lg invoice-preview ticket-format">
        <div className="text-center mb-4">
          {logo && <img src={logo} alt="Logo" className="h-16 mx-auto mb-2" />}
          <h2 className="font-bold text-sm">{invoice.emisor.nombre}</h2>
          <p className="text-xs">NIT: {invoice.emisor.nit}</p>
          <p className="text-xs">{invoice.emisor.direccion}</p>
        </div>

        <div className="border-t border-b py-2 mb-2 text-xs">
          <p><strong>No:</strong> {invoice.numero}</p>
          <p><strong>Serie:</strong> {invoice.serie}</p>
          <p><strong>Fecha:</strong> {invoice.fecha}</p>
        </div>

        <div className="mb-2 text-xs">
          <p><strong>Cliente:</strong> {invoice.receptor.nombre}</p>
          <p><strong>NIT:</strong> {invoice.receptor.nit}</p>
        </div>

        <table className="w-full text-xs mb-2">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Descripción</th>
              <th className="text-right py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-1">
                  {item.descripcion}
                  <br />
                  <span className="text-gray-600">
                    {item.cantidad} x Q{item.precioUnitario.toFixed(2)}
                  </span>
                </td>
                <td className="text-right py-1">Q{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="py-2">TOTAL:</td>
              <td className="text-right py-2">Q{invoice.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <InvoiceFooter
          invoice={invoice}
          footerText={footerText}
        />
      </div>
    );
  }

  // Renderizar plantillas premium solo para carta/mediaCarta
  if (!useClassicTemplate) {
    if (template === 'moderna') {
      return <ModernaTemplate invoice={invoice} logo={logo} format={format} footerText={footerText} headerColor={headerColor} borderColor={borderColor} />;
    }

    if (template === 'minimalista') {
      return <MinimalistaTemplate invoice={invoice} logo={logo} format={format} footerText={footerText} headerColor={headerColor} borderColor={borderColor} />;
    }

    if (template === 'corporativa') {
      return <CorporativaTemplate invoice={invoice} logo={logo} format={format} footerText={footerText} headerColor={headerColor} borderColor={borderColor} />;
    }
  }

  // Ajuste de tamaño real para formato carta y media carta
  const containerClass = format === 'mediaCarta'
    ? 'w-[612px] media-carta-format'
    : 'w-[816px] carta-format';

  return (
    <div className={`${containerClass} mx-auto bg-white p-8 shadow-lg print:shadow-none print:border-0 print:rounded-none invoice-preview`}>
      <InvoiceHeader
        emisor={invoice.emisor}
        numero={invoice.numero}
        serie={invoice.serie}
        fecha={invoice.fecha}
        logo={logo}
        borderColor={borderColor}
      />

      <ClientInfo
        receptor={invoice.receptor}
        borderColor={borderColor}
      />

      <InvoiceItems
        items={invoice.items}
        total={invoice.total}
        headerColor={headerColor}
        borderColor={borderColor}
      />

      <InvoiceFooter
        invoice={invoice}
        footerText={footerText}
      />
    </div>
  );
};
