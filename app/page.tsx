"use client"
import { db } from '../lib/db';
import { useState, useEffect } from 'react';
import { Producto, Venta } from '../lib/types';
import { crearVenta } from '../lib/data';
export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<{ producto: Producto; cantidad: number }[]>([]);
  
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosFromDB = await db.productos.getAll();
        console.log('Productos obtenidos:', productosFromDB);
        setProductos(productosFromDB);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    
    fetchProductos();
  }, []);

  const agregarVenta = async () => {
    if (carrito.length === 0) return;
    
    const total = carrito.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
    const venta: Omit<Venta, 'id'> = {
      fecha: new Date().toISOString(),
      productos: carrito,
      total
    };
    
    try {
      // Utilizando obtenerVentas para agregar la venta
      await db.ventas.getAll().then(async ventas => {
        const nuevaVenta = {
          ...venta,
          id: ventas.length + 1 // Asumiendo que el id es autoincremental
        };
        const ventaCreada = await crearVenta({...nuevaVenta, id: nuevaVenta.id.toString()});
        console.log('Venta agregada:', ventaCreada);
      });
      setCarrito([]);
      // Actualizar la lista de productos si es necesario
      const productosActualizados = await db.productos.getAll();
      setProductos(productosActualizados);
    } catch (error) {
      console.error('Error al agregar la venta:', error);
    }
  };

  const eliminarProductoDelCarrito = (idProducto: string) => {
    setCarrito(carrito.filter(item => item.producto.id !== idProducto));
  };

  const agregarProductoAlCarrito = (producto: Producto, cantidad: number) => {
    setCarrito([...carrito, { producto, cantidad }]);
  };

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {productos.map(producto => (
          <li key={producto.id}>{producto.nombre} - Precio: ${producto.precio}</li>
        ))}
      </ul>
      <h1>Carrito</h1>
      <ul>
        {carrito.map(item => (
          <li key={item.producto.id}>{item.producto.nombre} - Cantidad: {item.cantidad}</li>
        ))}
      </ul>
      <button onClick={agregarVenta}>Agregar Venta</button>
    </div>
  );
}