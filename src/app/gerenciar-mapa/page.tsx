"use client"

import { useRouter } from "next/navigation"
import { LogOut, Map, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GlobalHeader from "@/app/global-header/page"

export default function GerenciarMapa() {
  const router = useRouter()

  const handleHome = () => {
    router.push("/tela-operador")
  }

  const irParaMapaDoDia = () => {
    router.push("/mapa-do-dia")
  }

  const irParaMapasPreliminares = () => {
    router.push("/mapas-preliminares")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <GlobalHeader
              title="Gerenciar Mapa Cirúrgico"
              showMapButton={true}
              onMapClick={irParaMapaDoDia}
              mapButtonText="Mapa do Dia"
              mapButtonIcon={<Map className="h-4 w-4 mr-1" />}
            />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:p-10 flex flex-col justify-center items-center bg-gray-100">
        <Card className="shadow-md w-full max-w-2xl">
          <CardHeader className="bg-white border-b pb-4">
            <CardTitle className="text-2xl font-bold text-center">Opções de Mapa Cirúrgico</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              className="w-full h-48 flex flex-col justify-center items-center bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-md shadow-md"
              onClick={irParaMapaDoDia}
            >
              <Map className="h-12 w-12 mb-3" />
              <h2 className="text-xl font-bold text-center">MAPA DO DIA</h2>
            </Button>

            <Button
              className="w-full h-48 flex flex-col justify-center items-center bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-md shadow-md"
              onClick={irParaMapasPreliminares}
            >
              <CalendarDays className="h-12 w-12 mb-3" />
              <h2 className="text-xl font-bold text-center">MAPAS PRELIMINARES</h2>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
