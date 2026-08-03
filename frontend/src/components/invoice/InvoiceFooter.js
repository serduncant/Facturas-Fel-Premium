import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { generateQRUrl } from '../../utils/qrGenerator';
export const InvoiceFooter = ({ invoice, footerText }) => {
    const [qrCode, setQrCode] = useState('');
    useEffect(() => {
        generateQRUrl(invoice).then(setQrCode);
    }, [invoice]);
    return (_jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { className: "col-span-2", children: [_jsx("p", { children: "No genera derecho a cr\u00E9dito fiscal" }), _jsx("p", { children: "R\u00E9gimen especial informar a la plataforma" }), _jsxs("p", { children: ["Autorizaci\u00F3n: ", invoice.certificador.autorizacion] }), _jsx("p", { children: "Superintendencia de Administraci\u00F3n Tributaria" }), _jsxs("p", { children: ["NIT Certificador: ", invoice.certificador.nit] }), _jsxs("p", { children: ["Certificador: ", invoice.certificador.nombre] }), _jsx("p", { className: "mt-4 font-semibold", children: footerText })] }), _jsx("div", { className: "flex justify-end items-end", children: qrCode && _jsx("img", { src: qrCode, alt: "QR Code", width: 120, height: 120 }) })] }));
};
