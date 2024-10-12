require('dotenv').config();
const { sql } = require('@vercel/postgres');

const connectionString = process.env.NEXT_PUBLIC_POSTGRES_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('Database connection string not found');
}

async function seed() {
  try {
    console.log('Iniciando seed...');
    console.log('Connection string:', connectionString);

    // Crear tabla de productos si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL UNIQUE,
        precio DECIMAL(10, 2) NOT NULL
      )
    `;

    // Crear tabla de ventas si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS ventas (
        id SERIAL PRIMARY KEY,
        fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        productos JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL
      )
    `;

    // Crear tabla de productos de venta si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS productos_de_venta (
        id SERIAL PRIMARY KEY,
        venta_id INTEGER NOT NULL REFERENCES ventas(id),
        producto_id INTEGER NOT NULL REFERENCES productos(id),
        cantidad INTEGER NOT NULL,
        UNIQUE (venta_id, producto_id)
      )
    `;

    // Insertar productos
    const productos = [
      { nombre: 'Torta sin papas', precio: 60 },
      { nombre: 'Torta con papas', precio: 95 },
      { nombre: 'Hamburguesa sencilla', precio: 115 },
      { nombre: 'Hamburguesa doble', precio: 130 },
      { nombre: 'Domicilio', precio: 30 },
      { nombre: 'Promo 3x150', precio: 150 },
      { nombre: 'Promo 2x170', precio: 170 },
    ];

    for (const producto of productos) {
      await sql`
        INSERT INTO productos (nombre, precio)
        VALUES (${producto.nombre}, ${producto.precio})
        ON CONFLICT (nombre) DO UPDATE SET precio = ${producto.precio}
      `;
    }

    console.log('Seed completado exitosamente');
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error);
    throw error;
  }
}

seed();