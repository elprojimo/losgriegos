"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HistoryIcon, ShoppingCartIcon, Utensils, Menu } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="border-b">
      <div className="container mx-auto flex flex-wrap items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2 px-4">
          <Utensils className="h-6 w-6" />
          <span className="text-lg font-bold">Los Griegos</span>
        </Link>
        <button
          className="md:hidden px-4	"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className={`w-full md:w-auto md:flex ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mt-4 md:mt-0">
            <Button
              asChild
              variant={pathname === "/" ? "default" : "ghost"}
              className="w-full md:w-auto"
            >
              <Link href="/nueva-venta">
                <ShoppingCartIcon className="mr-2 h-4 w-4" />
                Nueva Venta
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/productos" ? "default" : "ghost"}
              className="w-full md:w-auto"
            >
              <Link href="/productos">
                <Utensils className="mr-2 h-4 w-4" />
                Productos
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/historial" ? "default" : "ghost"}
              className="w-full md:w-auto"
            >
              <Link href="/historial">
                <HistoryIcon className="mr-2 h-4 w-4" />
                Historial
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}