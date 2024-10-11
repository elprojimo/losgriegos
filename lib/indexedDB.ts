import { openDB, DBSchema } from 'idb';
import { Producto, Venta } from './types';

interface MyDB extends DBSchema {
  productos: {
    key: string;
    value: Producto;
  };
  ventas: {
    key: string;
    value: Venta;
  };
}

const dbPromise = openDB<MyDB>('tienda-db', 1, {
  upgrade(db) {
    db.createObjectStore('productos', { keyPath: 'id' });
    db.createObjectStore('ventas', { keyPath: 'id' });
  },
});

export const indexedDB = {
  async getAll(store: 'productos' | 'ventas') {
    return (await dbPromise).getAll(store);
  },
  async get(store: 'productos' | 'ventas', id: string) {
    return (await dbPromise).get(store, id);
  },
  async add(store: 'productos' | 'ventas', item: Producto | Venta) {
    return (await dbPromise).add(store, item);
  },
  async put(store: 'productos' | 'ventas', item: Producto | Venta) {
    return (await dbPromise).put(store, item);
  },
  async delete(store: 'productos' | 'ventas', id: string) {
    return (await dbPromise).delete(store, id);
  },
  async clear(store: 'productos' | 'ventas') {
    return (await dbPromise).clear(store);
  },
};