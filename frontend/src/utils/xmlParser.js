import { XMLParser } from 'fast-xml-parser';
import { extractEmisorData, extractReceptorData, extractItemsData, extractCertificacionData } from './xmlExtractors';
import { formatDate } from './dateFormatter';
import { validateXML } from './xmlValidator';
const parserOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '$',
    textNodeName: '_text',
    parseAttributeValue: true,
    allowBooleanAttributes: true,
    ignoreNameSpace: false,
    trimValues: true
};
export const parseXML = (xmlString) => {
    return new Promise((resolve, reject) => {
        try {
            const validation = validateXML(xmlString);
            if (!validation.isValid) {
                throw new Error(validation.error || 'XML inválido');
            }
            const parser = new XMLParser(parserOptions);
            const result = parser.parse(xmlString);
            if (!result['dte:GTDocumento']) {
                throw new Error('El archivo no contiene la estructura GTDocumento esperada');
            }
            const gtDoc = result['dte:GTDocumento'];
            if (!gtDoc['dte:SAT']) {
                throw new Error('Falta el elemento SAT en el documento');
            }
            const sat = gtDoc['dte:SAT'];
            if (!sat['dte:DTE']) {
                throw new Error('Falta el elemento DTE en el documento');
            }
            const dte = sat['dte:DTE'];
            if (!dte['dte:DatosEmision']) {
                throw new Error('Falta el elemento DatosEmision en el DTE');
            }
            const datosEmision = dte['dte:DatosEmision'];
            if (!datosEmision['dte:Emisor']) {
                throw new Error('Faltan datos del emisor');
            }
            if (!datosEmision['dte:Receptor']) {
                throw new Error('Faltan datos del receptor');
            }
            if (!datosEmision['dte:DatosGenerales']) {
                throw new Error('Faltan datos generales de la factura');
            }
            if (!dte['dte:Certificacion']) {
                throw new Error('Falta información de certificación');
            }
            const datosGenerales = datosEmision['dte:DatosGenerales'];
            const certificacion = dte['dte:Certificacion'];
            const numeroAutorizacion = certificacion['dte:NumeroAutorizacion'];
            const invoice = {
                emisor: extractEmisorData(datosEmision['dte:Emisor']),
                receptor: extractReceptorData(datosEmision['dte:Receptor']),
                fecha: formatDate(String(datosGenerales.$FechaHoraEmision || new Date().toISOString())),
                numero: String(numeroAutorizacion?.$Numero || certificacion['dte:NumeroAutorizacion'] || ''),
                serie: String(numeroAutorizacion?.$Serie || ''),
                items: extractItemsData(datosEmision['dte:Items']?.['dte:Item']),
                total: parseFloat(String(datosEmision['dte:Totales']?.['dte:GranTotal'] || '0')),
                certificador: extractCertificacionData(certificacion)
            };
            if (!invoice.items || invoice.items.length === 0) {
                throw new Error('La factura no contiene items');
            }
            if (invoice.total <= 0) {
                throw new Error('El total de la factura debe ser mayor a cero');
            }
            if (!invoice.certificador.autorizacion) {
                throw new Error('Falta el número de autorización');
            }
            resolve(invoice);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('Error detallado al procesar XML:', error);
            reject(new Error(`Error al procesar el XML: ${errorMessage}`));
        }
    });
};
