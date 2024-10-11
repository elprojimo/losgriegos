import { obtenerProductos, obtenerVentas } from './data';

export const db = {
  productos: {
    getAll: obtenerProductos,
  },
  ventas: {
    getAll: obtenerVentas,
  },
};