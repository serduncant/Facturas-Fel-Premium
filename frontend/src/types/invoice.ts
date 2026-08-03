import type { Emisor, Receptor, Item, Certificador } from './entities';

export interface Invoice {
  emisor: Emisor;
  receptor: Receptor;
  fecha: string;
  numero: string;
  serie: string;
  items: Item[];
  total: number;
  certificador: Certificador;
  savedAt?: string;
}
