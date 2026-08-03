import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InvoiceHeader } from './InvoiceHeader';
import { ClientInfo } from './ClientInfo';
import { InvoiceItems } from './InvoiceItems';
import { InvoiceFooter } from './InvoiceFooter';
import { ModernaTemplate } from './templates/ModernaTemplate';
import { MinimalistaTemplate } from './templates/MinimalistaTemplate';
import { CorporativaTemplate } from './templates/CorporativaTemplate';
export const InvoicePreview = ({ invoice, logo, format, footerText, headerColor, borderColor, template = 'clasica' }) => {
    // IMPORTANTE: Formato ticket siempre usa plantilla clásica
    const useClassicTemplate = template === 'clasica';
    // Renderizar plantilla ticket (clásica)
    if (format === 'ticket') {
        return (_jsxs("div", { className: "w-full max-w-[216px] mx-auto bg-white p-4 shadow-lg invoice-preview ticket-format", children: [_jsxs("div", { className: "text-center mb-4", children: [logo && _jsx("img", { src: logo, alt: "Logo", className: "h-16 mx-auto mb-2" }), _jsx("h2", { className: "font-bold text-sm", children: invoice.emisor.nombre }), _jsxs("p", { className: "text-xs", children: ["NIT: ", invoice.emisor.nit] }), _jsx("p", { className: "text-xs", children: invoice.emisor.direccion })] }), _jsxs("div", { className: "border-t border-b py-2 mb-2 text-xs", children: [_jsxs("p", { children: [_jsx("strong", { children: "No:" }), " ", invoice.numero] }), _jsxs("p", { children: [_jsx("strong", { children: "Serie:" }), " ", invoice.serie] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha:" }), " ", invoice.fecha] })] }), _jsxs("div", { className: "mb-2 text-xs", children: [_jsxs("p", { children: [_jsx("strong", { children: "Cliente:" }), " ", invoice.receptor.nombre] }), _jsxs("p", { children: [_jsx("strong", { children: "NIT:" }), " ", invoice.receptor.nit] })] }), _jsxs("table", { className: "w-full text-xs mb-2", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left py-1", children: "Descripci\u00F3n" }), _jsx("th", { className: "text-right py-1", children: "Total" })] }) }), _jsx("tbody", { children: invoice.items.map((item, idx) => (_jsxs("tr", { className: "border-b", children: [_jsxs("td", { className: "py-1", children: [item.descripcion, _jsx("br", {}), _jsxs("span", { className: "text-gray-600", children: [item.cantidad, " x Q", item.precioUnitario.toFixed(2)] })] }), _jsxs("td", { className: "text-right py-1", children: ["Q", item.total.toFixed(2)] })] }, idx))) }), _jsx("tfoot", { children: _jsxs("tr", { className: "font-bold", children: [_jsx("td", { className: "py-2", children: "TOTAL:" }), _jsxs("td", { className: "text-right py-2", children: ["Q", invoice.total.toFixed(2)] })] }) })] }), _jsx(InvoiceFooter, { invoice: invoice, footerText: footerText })] }));
    }
    // Renderizar plantillas premium solo para carta/mediaCarta
    if (!useClassicTemplate) {
        if (template === 'moderna') {
            return _jsx(ModernaTemplate, { invoice: invoice, logo: logo, format: format, footerText: footerText, headerColor: headerColor, borderColor: borderColor });
        }
        if (template === 'minimalista') {
            return _jsx(MinimalistaTemplate, { invoice: invoice, logo: logo, format: format, footerText: footerText, headerColor: headerColor, borderColor: borderColor });
        }
        if (template === 'corporativa') {
            return _jsx(CorporativaTemplate, { invoice: invoice, logo: logo, format: format, footerText: footerText, headerColor: headerColor, borderColor: borderColor });
        }
    }
    // Ajuste de tamaño real para formato carta y media carta
    const containerClass = format === 'mediaCarta'
        ? 'w-[612px] media-carta-format'
        : 'w-[816px] carta-format';
    return (_jsxs("div", { className: `${containerClass} mx-auto bg-white p-8 shadow-lg invoice-preview`, children: [_jsx(InvoiceHeader, { emisor: invoice.emisor, numero: invoice.numero, serie: invoice.serie, fecha: invoice.fecha, logo: logo, borderColor: borderColor }), _jsx(ClientInfo, { receptor: invoice.receptor, borderColor: borderColor }), _jsx(InvoiceItems, { items: invoice.items, total: invoice.total, headerColor: headerColor, borderColor: borderColor }), _jsx(InvoiceFooter, { invoice: invoice, footerText: footerText })] }));
};
