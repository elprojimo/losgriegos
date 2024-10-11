"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CakeIcon, HistoryIcon, ShoppingCartIcon, Utensils } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <Utensils className="h-6 w-6" />
          <span className="text-lg font-bold">Los Griegos</span>
        </Link>
        <div className="flex space-x-4">
          <Button
            asChild
            variant={pathname === "/" ? "default" : "ghost"}
          >
            <Link href="/nueva-venta">
              <ShoppingCartIcon className="mr-2 h-4 w-4" />
              Nueva Venta
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/productos" ? "default" : "ghost"}
          >
            <Link href="/productos">
              <Utensils className="mr-2 h-4 w-4" />
              Productos
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/historial" ? "default" : "ghost"}
          >
            <Link href="/historial">
              <HistoryIcon className="mr-2 h-4 w-4" />
              Historial
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}