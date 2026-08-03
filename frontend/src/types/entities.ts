export interface Emisor {
    nombre: string;
    nit: string;
    direccion: string;
  }
  
  export interface Receptor {
    nombre: string;
    nit: string;
    direccion: string;
  }
  
  export interface Item {
    cantidad: number;
    descripcion: string;
    precioUnitario: number;
    total: number;
  }
  
  export interface Certificador {
    nombre: string;
    nit: string;
    autorizacion: string;
  }
  