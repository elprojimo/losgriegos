export interface Producto {
  id: string;
  nombre: string;
  precio: number;
}

export interface Venta {
  id: string;
  fecha: string;
  productos: Array<{
    producto: Producto;
    cantidad: number;
  }>;
  total: number;
}