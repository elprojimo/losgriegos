"use client"
import { useState, useEffect } from 'react'
import { Producto, Venta } from '@/lib/types'
import { db } from '@/lib/db'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { crearVenta } from '@/lib/data'

export default function NuevaVentaPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [ventaItems, setVentaItems] = useState<{ producto: Producto; cantidad: number }[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const loadedProductos = await db.productos.getAll()
        setProductos(loadedProductos)
      } catch (error) {
        console.error("Error loading productos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos. Por favor, intente de nuevo.",
          variant: "destructive",
        })
      }
    }
    loadProductos()
  }, [toast])

  const handleAddItem = (producto: Producto) => {
    const existingItem = ventaItems.find(item => item.producto.id === producto.id)
    if (existingItem) {
      setVentaItems(ventaItems.map(item =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
    } else {
      setVentaItems([...ventaItems, { producto, cantidad: 1 }])
    }
  }

  const handleRemoveItem = (index: number) => {
    setVentaItems(ventaItems.filter((_, i) => i !== index))
  }

  const handleSubmitVenta = async () => {
    if (ventaItems.length === 0) return

    const total = ventaItems.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0)
    const venta: Omit<Venta, 'id'> = {
      fecha: new Date().toISOString(),
      productos: ventaItems,
      total
    }

    try {
      await crearVenta({...venta, id: ''})
      setVentaItems([])
      toast({
        title: "Venta registrada",
        description: `Venta por $${total.toLocaleString()} registrada exitosamente.`,
      })
    } catch (error) {
      console.error("Error creating venta:", error)
      toast({
        title: "Error",
        description: "No se pudo registrar la venta. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registrar Nueva Venta</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {productos.map((producto) => (
          <Card key={producto.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{producto.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>${producto.precio.toLocaleString()}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button onClick={() => handleAddItem(producto)} className="w-full">
                Agregar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Table className="mb-24">
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio Unitario</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventaItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.producto.nombre}</TableCell>
              <TableCell>{item.cantidad}</TableCell>
              <TableCell>${item.producto.precio.toLocaleString()}</TableCell>
              <TableCell>${(item.producto.precio * item.cantidad).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleRemoveItem(index)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          Total: ${ventaItems.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0).toLocaleString()}
        </div>
        <Button onClick={handleSubmitVenta} disabled={ventaItems.length === 0}>Registrar Venta</Button>
      </div>
    </div>
  )
}