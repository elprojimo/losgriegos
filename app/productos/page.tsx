"use client"

import { useState, useEffect } from 'react'
import { Producto } from '@/lib/types'
import { db } from '@/lib/db'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { crearProducto, eliminarProducto } from '@/lib/data';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    loadProductos()
  }, [])

  const loadProductos = async () => {
    const loadedProductos = await db.productos.getAll()
    setProductos(loadedProductos)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (nombre && precio) {
      const newProducto: Producto = await crearProducto({ nombre, precio: Number(precio), id: '' }) as Producto
      setProductos([...productos, newProducto])
      setNombre('')
      setPrecio('')
      toast({
        title: "Producto agregado",
        description: `${newProducto.nombre} ha sido agregado exitosamente.`,
      })
    }
  }

  const handleDelete = async (id: string) => {
    await eliminarProducto(id)
    setProductos(productos.filter(p => p.id !== id))
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado exitosamente.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <Input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del producto"
          required
        />
        <Input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
          required
        />
        <Button type="submit">Agregar Producto</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell>{producto.nombre}</TableCell>
              <TableCell>${producto.precio.toLocaleString()}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará permanentemente el producto {producto.nombre}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(producto.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}