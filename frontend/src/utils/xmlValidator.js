import { XMLParser } from 'fast-xml-parser';
export const validateXML = (xmlString) => {
    const warnings = [];
    try {
        if (!xmlString || !xmlString.trim()) {
            return {
                isValid: false,
                error: 'El archivo XML está vacío o no contiene datos válidos'
            };
        }
        if (!xmlString.includes('<?xml') && !xmlString.includes('<dte:GTDocumento')) {
            return {
                isValid: false,
                error: 'El archivo no tiene un formato XML válido'
            };
        }
        if (!xmlString.includes('GTDocumento')) {
            return {
                isValid: false,
                error: 'El archivo no es una factura electrónica FEL de Guatemala válida'
            };
        }
        const requiredElements = [
            'dte:SAT',
            'dte:DTE',
            'dte:DatosEmision',
            'dte:Emisor',
            'dte:Receptor',
            'dte:Certificacion'
        ];
        for (const element of requiredElements) {
            if (!xmlString.includes(element)) {
                return {
                    isValid: false,
                    error: `Falta el elemento requerido: ${element}`
                };
            }
        }
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseTagValue: false,
            trimValues: true
        });
        try {
            parser.parse(xmlString);
        }
        catch (parseError) {
            const errorMessage = parseError instanceof Error ? parseError.message : 'Error desconocido';
            return {
                isValid: false,
                error: `Error de sintaxis XML: ${errorMessage}`
            };
        }
        if (!xmlString.includes('Version="0.1"') && !xmlString.includes('Version="0.4"')) {
            warnings.push('La versión del documento podría no ser compatible');
        }
        if (!xmlString.includes('ds:Signature')) {
            warnings.push('El documento no parece contener firma digital');
        }
        return {
            isValid: true,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        return {
            isValid: false,
            error: `Error inesperado al validar XML: ${errorMessage}`
        };
    }
};
