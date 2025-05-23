"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, ClipboardList, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

export default function TelaOperador() {
  const router = useRouter()
  const { toast } = useToast()
  const [showTooltip, setShowTooltip] = useState(false)

  // Número de solicitações pendentes
  const numSolicitacoes = 13

  // Função para fazer logout
  const handleLogout = () => {
    // Aqui seria implementada a lógica de logout (limpar tokens, etc)
    router.push("/login")
  }

  // Função para navegar para a tela de análise de solicitações
  const irParaAnaliseSolicitacoes = () => {
    router.push("/analisar-solicitacoes")
  }

  // Função para navegar para a tela de gerenciamento de mapeamento cirúrgico
  const irParaGerenciamentoMapa = () => {
    router.push("/mapa-cirurgico")
  }

  // Função para navegar para a tela de gerenciamento de equipes
  const irParaGerenciamentoEquipes = () => {
    router.push("/equipes-cirurgicas")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <header className="w-full bg-[#1E40AF] py-3 px-4 flex justify-between items-center text-white shadow-md">
        <h1 className="text-lg md:text-xl font-medium">Acesso de operador</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base">Enfermeiro(a) Luciano</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-blue-700">
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:p-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card Analisar Solicitações */}
          <TooltipProvider>
            <div className="relative">
              <Tooltip open={showTooltip}>
                <TooltipTrigger asChild>
                  <Card
                    className="bg-[#1E40AF] hover:bg-blue-700 transition-colors border-2 border-blue-900 h-48 flex flex-col items-center justify-center cursor-pointer relative shadow-md"
                    onClick={irParaAnaliseSolicitacoes}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold border-2 border-white shadow-md">
                      {numSolicitacoes}
                    </div>
                    <ClipboardList className="h-12 w-12 mb-3 text-white" />
                    <h2 className="text-xl font-bold text-center text-white">
                      Analisar
                      <br />
                      Solicitações
                    </h2>
                  </Card>
                </TooltipTrigger>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Card Gerenciar Mapeamento Cirúrgico */}
          <Card
            className="bg-[#1E40AF] hover:bg-blue-700 transition-colors border-2 border-blue-900 h-48 flex flex-col items-center justify-center cursor-pointer shadow-md"
            onClick={irParaGerenciamentoMapa}
          >
            <Calendar className="h-12 w-12 mb-3 text-white" />
            <h2 className="text-xl font-bold text-center text-white">
              Gerenciar
              <br />
              Mapeamento Cirúrgico
            </h2>
          </Card>

          {/* Card Gerenciar Equipes Cirúrgicas */}
          <Card
            className="bg-[#1E40AF] hover:bg-blue-700 transition-colors border-2 border-blue-900 h-48 flex flex-col items-center justify-center cursor-pointer shadow-md"
            onClick={irParaGerenciamentoEquipes}
          >
            <Users className="h-12 w-12 mb-3 text-white" />
            <h2 className="text-xl font-bold text-center text-white">
              Gerenciar
              <br />
              Equipes Cirúrgicas
            </h2>
          </Card>
        </div>
      </main>
    </div>
  )
}
