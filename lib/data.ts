import { Producto, Venta } from './types';
import { sql } from '@vercel/postgres';

export const obtenerProductos = async (): Promise<Producto[]> => {
  try {
    const { rows } = await sql<Producto>`SELECT * FROM productos`;
    return rows;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('No se pudieron obtener los productos');
  }
};

export const obtenerVentas = async (): Promise<Venta[]> => {
  try {
    const { rows } = await sql<Venta>`SELECT * FROM ventas`;
    return rows;
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    throw new Error('No se pudieron obtener las ventas');
  }
};

export const crearProducto = async (producto: Producto): Promise<Producto> => {
  try {
    const { rows } = await sql<Producto>`INSERT INTO productos (nombre, precio) VALUES (${producto.nombre}, ${producto.precio}) RETURNING *`;
    return rows[0];
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw new Error('No se pudo crear el producto');
  }
};

export const editarProducto = async (id: string, producto: Producto): Promise<Producto> => {
  try {
    const { rows } = await sql<Producto>`UPDATE productos SET nombre = ${producto.nombre}, precio = ${producto.precio} WHERE id = ${id} RETURNING *`;
    return rows[0];
  } catch (error) {
    console.error('Error al editar producto:', error);
    throw new Error('No se pudo editar el producto');
  }
};

export const eliminarProducto = async (id: string): Promise<void> => {
  try {
    await sql`DELETE FROM productos WHERE id = ${id}`;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw new Error('No se pudo eliminar el producto');
  }
};

export const crearVenta = async (venta: Venta): Promise<Venta> => {
  try {
    console.log(venta)
    const { rows } = await sql<Venta>`INSERT INTO ventas (fecha, total, productos) VALUES (${venta.fecha}, ${venta.total}, ${JSON.stringify(venta.productos)}) RETURNING *`;
    const ventaCreada = rows[0];
    console.log(ventaCreada)
    await Promise.all(venta.productos.map(async (producto) => {
      await sql`INSERT INTO productos_de_venta (venta_id, producto_id, cantidad) VALUES (${ventaCreada.id}, ${producto.producto.id}, ${producto.cantidad})`;
    }));
    return ventaCreada;
  } catch (error) {
    console.error('Error al crear venta:', error);
    throw new Error('No se pudo crear la venta');
  }
};

export const editarVenta = async (id: string, venta: Venta): Promise<Venta> => {
  try {
    const { rows } = await sql<Venta>`UPDATE ventas SET fecha = ${venta.fecha}, total = ${venta.total}, productos = ${JSON.stringify(venta.productos)} WHERE id = ${id} RETURNING *`;
    const ventaActualizada = rows[0];
    await sql`DELETE FROM productos_de_venta WHERE venta_id = ${id}`;
    await Promise.all(venta.productos.map(async (producto) => {
      await sql`INSERT INTO productos_de_venta (venta_id, producto_id, cantidad) VALUES (${ventaActualizada.id}, ${producto.producto.id}, ${producto.cantidad})`;
    }));
    return ventaActualizada;
  } catch (error) {
    console.error('Error al editar venta:', error);
    throw new Error('No se pudo editar la venta');
  }
};

export const eliminarVenta = async (id: string): Promise<void> => {
  try {
    await sql`DELETE FROM productos_de_venta WHERE venta_id = ${id}`;
    await sql`DELETE FROM ventas WHERE id = ${id}`;
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    throw new Error('No se pudo eliminar la venta');
  }
};