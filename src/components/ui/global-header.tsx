"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { LogOut, Home } from 'lucide-react'
import { Button } from "@/components/ui/button"
import HamburgerMenu from "@/app/hamburger-menu/page"

interface GlobalHeaderProps {
  title: string
  userName?: string
  showMapButton?: boolean
  onMapClick?: () => void
  mapButtonText?: string
  mapButtonIcon?: React.ReactNode
}

export default function GlobalHeader({
  title,
  userName = "Enfermeiro(a) Luciano",
  showMapButton = false,
  onMapClick,
  mapButtonText = "Mapa do Dia",
  mapButtonIcon,
}: GlobalHeaderProps) {
  const router = useRouter()

  const handleHome = () => {
    router.push("/tela-operador")
  }

  const handleLogout = () => {
    router.push("/home")
  }

  return (
    <>
      <HamburgerMenu />
      <header className="w-full bg-[#1E40AF] py-3 px-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12"></div> {/* Espaço para o menu hamburger */}
          <h1 className="text-lg md:text-xl font-medium">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base">{userName}</span>
          {showMapButton && onMapClick && (
            <Button variant="ghost" size="sm" onClick={onMapClick} className="text-white hover:bg-blue-700">
              {mapButtonIcon}
              <span className="hidden sm:inline">{mapButtonText}</span>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleHome} className="text-white hover:bg-blue-700">
            <Home className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-blue-700">
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>
    </>
  )
}
