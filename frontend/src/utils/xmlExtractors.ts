import type { Emisor, Receptor, Item, Certificador } from '../types/entities';

const extractTextValue = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && '$' in value) return String((value as Record<string, unknown>)['$']);
  if (typeof value === 'object' && value !== null && '_text' in value) return String((value as Record<string, unknown>)._text);
  if (typeof value === 'object' && value !== null && '$NombreEmisor' in value) return String((value as Record<string, unknown>)['$NombreEmisor']);
  if (typeof value === 'object' && value !== null && '$NombreComercial' in value) return String((value as Record<string, unknown>)['$NombreComercial']);
  return String(value);
};

const extractNumberValue = (value: unknown): number => {
  const text = extractTextValue(value);
  return parseFloat(text) || 0;
};

export const extractEmisorData = (emisorData: Record<string, unknown>): Emisor => {
  if (!emisorData) {
    throw new Error('Datos del emisor no encontrados');
  }
  
  return {
    nombre: String(emisorData['$NombreComercial'] || emisorData['$NombreEmisor']),
    nit: String(emisorData['$NITEmisor']),
    direccion: extractTextValue((emisorData['dte:DireccionEmisor'] as Record<string, unknown>)?.['dte:Direccion'])
  };
};

export const extractReceptorData = (receptorData: Record<string, unknown>): Receptor => {
  if (!receptorData) {
    throw new Error('Datos del receptor no encontrados');
  }

  return {
    nombre: String(receptorData['$NombreReceptor']),
    nit: String(receptorData['$IDReceptor']),
    direccion: extractTextValue((receptorData['dte:DireccionReceptor'] as Record<string, unknown>)?.['dte:Direccion'])
  };
};

export const extractItemsData = (itemsData: unknown): Item[] => {
  if (!itemsData) {
    return [];
  }

  const items = Array.isArray(itemsData) ? itemsData : [itemsData];
  return items.map((item: Record<string, unknown>) => ({
    cantidad: extractNumberValue(item['dte:Cantidad']),
    descripcion: extractTextValue(item['dte:Descripcion']),
    precioUnitario: extractNumberValue(item['dte:PrecioUnitario']),
    total: extractNumberValue(item['dte:Total'])
  }));
};

export const extractCertificacionData = (certData: Record<string, unknown>): Certificador => {
  if (!certData) {
    throw new Error('Datos del certificador no encontrados');
  }

  const numeroAutorizacion = certData['dte:NumeroAutorizacion'];
  const autorizacion = typeof numeroAutorizacion === 'string' ? 
    numeroAutorizacion : 
    String((numeroAutorizacion as Record<string, unknown>)?._text || (numeroAutorizacion as Record<string, unknown>)?.$UUID || '');

  return {
    nombre: extractTextValue(certData['dte:NombreCertificador']),
    nit: extractTextValue(certData['dte:NITCertificador']),
    autorizacion
  };
};
