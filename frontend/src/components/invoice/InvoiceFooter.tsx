import React, { useEffect, useState } from 'react';
import type { Invoice } from '../../types/invoice';
import { generateQRUrl } from '../../utils/qrGenerator';

interface InvoiceFooterProps {
  invoice: Invoice;
  footerText: string;
}

export const InvoiceFooter: React.FC<InvoiceFooterProps> = ({
  invoice,
  footerText
}) => {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    generateQRUrl(invoice).then(setQrCode);
  }, [invoice]);

  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div className="col-span-2">
        <p>No genera derecho a crédito fiscal</p>
        <p>Régimen especial informar a la plataforma</p>
        <p>Autorización: {invoice.certificador.autorizacion}</p>
        <p>Superintendencia de Administración Tributaria</p>
        <p>NIT Certificador: {invoice.certificador.nit}</p>
        <p>Certificador: {invoice.certificador.nombre}</p>
        <p className="mt-4 font-semibold">{footerText}</p>
      </div>
      <div className="flex justify-end items-end">
        {qrCode && <img src={qrCode} alt="QR Code" width={120} height={120} />}
      </div>
    </div>
  );
};
