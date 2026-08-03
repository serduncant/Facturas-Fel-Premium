const extractTextValue = (value) => {
    if (!value)
        return '';
    if (typeof value === 'string')
        return value;
    if (typeof value === 'object' && value !== null && '$' in value)
        return String(value['$']);
    if (typeof value === 'object' && value !== null && '_text' in value)
        return String(value._text);
    if (typeof value === 'object' && value !== null && '$NombreEmisor' in value)
        return String(value['$NombreEmisor']);
    if (typeof value === 'object' && value !== null && '$NombreComercial' in value)
        return String(value['$NombreComercial']);
    return String(value);
};
const extractNumberValue = (value) => {
    const text = extractTextValue(value);
    return parseFloat(text) || 0;
};
export const extractEmisorData = (emisorData) => {
    if (!emisorData) {
        throw new Error('Datos del emisor no encontrados');
    }
    return {
        nombre: String(emisorData['$NombreComercial'] || emisorData['$NombreEmisor']),
        nit: String(emisorData['$NITEmisor']),
        direccion: extractTextValue(emisorData['dte:DireccionEmisor']?.['dte:Direccion'])
    };
};
export const extractReceptorData = (receptorData) => {
    if (!receptorData) {
        throw new Error('Datos del receptor no encontrados');
    }
    return {
        nombre: String(receptorData['$NombreReceptor']),
        nit: String(receptorData['$IDReceptor']),
        direccion: extractTextValue(receptorData['dte:DireccionReceptor']?.['dte:Direccion'])
    };
};
export const extractItemsData = (itemsData) => {
    if (!itemsData) {
        return [];
    }
    const items = Array.isArray(itemsData) ? itemsData : [itemsData];
    return items.map((item) => ({
        cantidad: extractNumberValue(item['dte:Cantidad']),
        descripcion: extractTextValue(item['dte:Descripcion']),
        precioUnitario: extractNumberValue(item['dte:PrecioUnitario']),
        total: extractNumberValue(item['dte:Total'])
    }));
};
export const extractCertificacionData = (certData) => {
    if (!certData) {
        throw new Error('Datos del certificador no encontrados');
    }
    const numeroAutorizacion = certData['dte:NumeroAutorizacion'];
    const autorizacion = typeof numeroAutorizacion === 'string' ?
        numeroAutorizacion :
        String(numeroAutorizacion?._text || numeroAutorizacion?.$UUID || '');
    return {
        nombre: extractTextValue(certData['dte:NombreCertificador']),
        nit: extractTextValue(certData['dte:NITCertificador']),
        autorizacion
    };
};
