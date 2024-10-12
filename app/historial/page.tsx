"use client"

import { useState, useEffect, useCallback } from 'react'
import { db } from '../../lib/db'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Venta } from '../../lib/types';
import { useToast } from "@/components/ui/use-toast"
import { eliminarVenta } from '@/lib/data';

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

export default function HistorialPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [ventaSeleccionada, setVentaSeleccionada] = useState<string | null>(null)
  const { toast } = useToast()
  
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const ventasFromDB = await db.ventas.getAll()
        const ventasFiltradas = ventasFromDB.filter(venta => {
          const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0]
          return fechaVenta === fecha
        })
        setVentas(ventasFiltradas)
      } catch (error) {
        console.error('Error al obtener ventas:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las ventas. Por favor, intente de nuevo.",
          variant: "destructive",
        })
      }
    };
    
    fetchVentas()
  }, [fecha, toast])

  const handleEliminarVenta = async () => {
    if (!ventaSeleccionada) return;
    try {
      await eliminarVenta(ventaSeleccionada);
      setVentas(ventas.filter(venta => venta.id !== ventaSeleccionada));
      setVentaSeleccionada(null);
    } catch (error) {
      console.error('Error al eliminar venta:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>
      <div className="mb-6 flex gap-4">
        <Input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-[200px]"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventas.map((venta) => (
            <TableRow key={venta.id}>
              <TableCell>{new Date(venta.fecha).toLocaleString()}</TableCell>
              <TableCell>
                {venta.productos.map((item, index) => (
                  <div key={index}>
                    {item.producto.nombre} x {item.cantidad} - <strong>${item.producto.precio.toLocaleString()}</strong>
                  </div>
                ))}
              </TableCell>
              <TableCell>${venta.total.toLocaleString()}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" onClick={() => setVentaSeleccionada(venta.id)}>Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará permanentemente la venta.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setVentaSeleccionada(null)}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleEliminarVenta}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 text-xl font-bold">
        Total del día: ${ventas.reduce((sum, venta) => sum + venta.total, 0).toLocaleString()}
      </div>
    </div>
  )
}