"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Check, BellOff, UserMinus, RefreshCw, LogOut, Map, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import GlobalHeader from "@/components/ui/global-header"

// Tipo para os dados de cada equipe
interface Equipe {
  id: number
  especialidade: string
  cirurgiaoPrincipal: string
  membros: number
  procedimentosRealizados: number
  ehMembro: boolean
  membrosList?: string[]
}

interface TeamJoinRequest {
  id: number
  teamId: number // Link to Equipe.id
  memberName: string
  memberSpecialty: string
  status: "pending" | "accepted" | "rejected"
}

// Dados fictícios para as equipes
const equipes: Equipe[] = [
  {
    id: 1,
    especialidade: "Ortopedia",
    cirurgiaoPrincipal: "Dr. Marcos Motta",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
    membrosList: ["Dr. Marcos Motta", "Dra. Ana Silva", "Dr. Paulo Mendes", "Dr. Roberto Alves"],
  },
  {
    id: 2,
    especialidade: "Cardiologia",
    cirurgiaoPrincipal: "Dr. Pedro Souza",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
    membrosList: ["Dr. Pedro Souza", "Dra. Paula Silva", "Dr. João Mendes", "Dr. Roberta Alves"],
  },
  {
    id: 3,
    especialidade: "Ortopedia",
    cirurgiaoPrincipal: "Dra. Ana Silva",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
    membrosList: ["Dra. Ana Silva", "Dr. Marcos Motta", "Dr. Paulo Mendes", "Dra. Carla Rodrigues"],
  },
  {
    id: 4,
    especialidade: "Neurologia",
    cirurgiaoPrincipal: "Dr. João Mendes",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
    membrosList: ["Dr. Pedro Souza", "Dra. Paula Silva", "Dr. João Mendes", "Dr. Roberta Alves"],
  },
  {
    id: 5,
    especialidade: "Cardiologia",
    cirurgiaoPrincipal: "Dra. Carla Rodrigues",
    membros: 5,
    procedimentosRealizados: 28,
    ehMembro: false,
    membrosList: ["Dra. Ana Silva", "Dr. Marcos Motta", "Dr. Paulo Mendes", "Dra. Carla Rodrigues", "Dr. Zico Petri"],
  },
  {
    id: 6,
    especialidade: "Neurologia",
    cirurgiaoPrincipal: "Dr. Paulo Mendes",
    membros: 6,
    procedimentosRealizados: 15,
    ehMembro: false,
    membrosList: [
      "Dr. Marcos Motta",
      "Dra. Ana Silva",
      "Dr. Paulo Mendes",
      "Dr. Roberto Alves",
      "Dra. Cintia Carvalho",
      "Dr. José Alencar",
    ],
  },
  {
    id: 7,
    especialidade: "Oftalmologia",
    cirurgiaoPrincipal: "Dra. Cintia Carvalho",
    membros: 3,
    procedimentosRealizados: 42,
    ehMembro: false,
    membrosList: ["Dra. Cintia Carvalho", "Dra. Carla Rodrigues", "Dr. John Lennon"],
  },
  {
    id: 8,
    especialidade: "Urologia",
    cirurgiaoPrincipal: "Dr. José Alencar",
    membros: 6,
    procedimentosRealizados: 19,
    ehMembro: false,
    membrosList: [
      "Dra. Cintia Carvalho",
      "Dr. José Alencar",
      "Dr. John Lennon",
      "Dr. Marcos Motta",
      "Dr. Paulo Mendes",
      "Dr. Roberto Alves",
    ],
  },
]

// Simulate requests for specific teams
const initialJoinRequests: Record<number, TeamJoinRequest[]> = {
  1: [
    // Team ID 1 (Ortopedia - Dr. Marcos Motta)
    { id: 101, teamId: 1, memberName: "Dr. João Novo", memberSpecialty: "Ortopedista", status: "pending" },
    { id: 102, teamId: 1, memberName: "Enf. Clara Luz", memberSpecialty: "Enfermeira", status: "pending" },
  ],
  5: [
    // Team ID 5 (Cardiologia - Dra. Ana Silva)
    { id: 201, teamId: 5, memberName: "Dr. Carlos Neto", memberSpecialty: "Cardiologista", status: "pending" },
  ],
}

export default function EquipesCirurgicasOperador() {
  const router = useRouter()
  const { toast } = useToast()
  const [filtroEspecialidade, setFiltroEspecialidade] = useState<string>("")
  const [filtroCirurgiao, setFiltroCirurgiao] = useState<string>("")
  const [equipesExibidas, setEquipesExibidas] = useState<Equipe[]>([]) // Initially empty
  const [showAllTeams, setShowAllTeams] = useState(false) // Control initial display
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Equipe | null>(null)
  const [joinRequests, setJoinRequests] = useState<Record<number, TeamJoinRequest[]>>(initialJoinRequests)

  // Lista de especialidades únicas para o filtro
  const especialidades = Array.from(new Set(equipes.map((eq) => eq.especialidade)))

  // Lista de cirurgiões únicos para o filtro
  const cirurgioes = Array.from(new Set(equipes.map((eq) => eq.cirurgiaoPrincipal)))

  // Aplicar filtros
  useEffect(() => {
    let resultado = equipes
    if (filtroEspecialidade) {
      resultado = resultado.filter((eq) => eq.especialidade === filtroEspecialidade)
    }
    if (filtroCirurgiao) {
      resultado = resultado.filter((eq) => eq.cirurgiaoPrincipal === filtroCirurgiao)
    }
    setEquipesExibidas(resultado)
  }, [filtroEspecialidade, filtroCirurgiao])

  // Limpar filtros
  const limparFiltros = () => {
    setFiltroEspecialidade("")
    setFiltroCirurgiao("")
    setShowAllTeams(true) // Show all teams after clearing filters
  }

  // Exibir detalhes da equipe
  const exibirDetalhes = (equipe: Equipe) => {
    setSelectedTeam(equipe)
    setShowDetailsDialog(true)
  }

  // Função para fazer logout
  const handleHome = () => {
    router.push("/tela-operador")
  }

  // Função para navegar para o mapa do dia
  const irParaMapaDoDia = () => {
    router.push("/mapa-cirurgico")
  }

  // Function to handle accepting/rejecting a request
  const handleRequestAction = (teamId: number, requestId: number, action: "accept" | "reject") => {
    setJoinRequests((prevRequests) => {
      const newRequests = { ...prevRequests }
      if (newRequests[teamId]) {
        newRequests[teamId] = newRequests[teamId].map((req) =>
          req.id === requestId ? { ...req, status: action === "accept" ? "accepted" : "rejected" } : req,
        )
      }
      return newRequests
    })
    toast({
      title: `Solicitação ${action === "accept" ? "aceita" : "rejeitada"}`,
      description: `A solicitação foi ${action === "accept" ? "aceita" : "rejeitada"} com sucesso.`,
    })
  }

  const pendingRequestsForSelectedTeam = selectedTeam
    ? (joinRequests[selectedTeam.id] || []).filter((req) => req.status === "pending")
    : []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
    <GlobalHeader
            title="Equipes Cirúrgicas"
            showMapButton={true}
            onMapClick={irParaMapaDoDia}
            mapButtonText="Mapa do Dia"
            mapButtonIcon={<Map className="h-4 w-4 mr-1" />}
          />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:p-10 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Exibir por:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <Select value={filtroEspecialidade} onValueChange={setFiltroEspecialidade}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map((esp) => (
                          <SelectItem key={esp} value={esp}>
                            {esp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Select value={filtroCirurgiao} onValueChange={setFiltroCirurgiao}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Cirurgião Principal" />
                      </SelectTrigger>
                      <SelectContent>
                        {cirurgioes.map((cir) => (
                          <SelectItem key={cir} value={cir}>
                            {cir}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="bg-blue-800 hover:bg-blue-700 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </Button>
                    <Button variant="outline" className="bg-white" onClick={limparFiltros}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Exibir todas
                    </Button>
                  </div>
                </div>
                {(filtroEspecialidade || filtroCirurgiao) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {filtroEspecialidade && (
                      <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                        Especialidade: {filtroEspecialidade}
                      </div>
                    )}
                    {filtroCirurgiao && (
                      <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                        Cirurgião: {filtroCirurgiao}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {showAllTeams && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {equipesExibidas.length > 0 ? (
                    equipesExibidas.map((equipe) => (
                      <div
                        key={equipe.id}
                        className="rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => exibirDetalhes(equipe)}
                      >
                        <div className="bg-white py-1 px-4 border-b">
                          <h3 className="text-center font-bold uppercase text-sm">
                            {equipe.cirurgiaoPrincipal} - {equipe.especialidade}
                          </h3>
                        </div>
                        <div className="bg-blue-100 p-4">
                          <div className="space-y-2">
                            <div>
                              <span className="font-bold">Especialidade:</span> {equipe.especialidade}
                            </div>
                            <div>
                              <span className="font-bold">Cirurgião principal:</span> {equipe.cirurgiaoPrincipal}
                            </div>
                            <div>
                              <span className="font-bold">Membros:</span> {equipe.membros.toString().padStart(2, "0")}
                            </div>
                            <div>
                              <span className="font-bold">Procedimentos realizados:</span>{" "}
                              {equipe.procedimentosRealizados}
                            </div>
                            <div className="flex justify-end">
                              {equipe.ehMembro && (
                                <div className="flex items-center text-xs">
                                  <div className="bg-green-500 rounded-full p-1 mr-1">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                  <span>Você é membro desta equipe!</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-white p-8 rounded-lg text-center">
                      <p className="text-gray-500">Nenhuma equipe encontrada com os filtros selecionados.</p>
                      <Button variant="link" onClick={limparFiltros} className="mt-2">
                        Limpar filtros
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal de detalhes da equipe */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          {selectedTeam && (
            <div className="p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold text-center">
                  {selectedTeam.cirurgiaoPrincipal} - {selectedTeam.especialidade}
                </DialogTitle>
              </DialogHeader>

              <div className="bg-blue-100 p-6 rounded-lg mb-4">
                <div className="space-y-4">
                  <div className="text-lg">
                    <span className="font-bold">Especialidade:</span> {selectedTeam.especialidade}
                  </div>
                  <div className="text-lg">
                    <span className="font-bold">Cirurgião principal:</span> {selectedTeam.cirurgiaoPrincipal}
                  </div>
                  <div className="text-lg">
                    <span className="font-bold">Membros:</span> {selectedTeam.membros.toString().padStart(2, "0")}
                  </div>
                  <div className="text-lg">
                    <span className="font-bold">Procedimentos realizados:</span> {selectedTeam.procedimentosRealizados}
                  </div>
                  {selectedTeam.membrosList && selectedTeam.membrosList.length > 0 && (
                    <div className="mt-4">
                      <div className="font-bold text-lg mb-2">Membros da Equipe:</div>
                      <div className="bg-blue-50 p-3 rounded-md shadow-sm">
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedTeam.membrosList.map((membro, index) => (
                            <li key={index}>{membro}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    {selectedTeam.ehMembro && (
                      <div className="flex items-center">
                        <div className="bg-green-500 rounded-full p-1 mr-2">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Você é membro desta equipe!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Seção de Solicitações para a Equipe */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Solicitações para esta Equipe</h3>
                {pendingRequestsForSelectedTeam.length > 0 ? (
                  <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {pendingRequestsForSelectedTeam.map((request) => (
                          <tr key={request.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="p-4 border-r border-gray-200">
                              <p className="text-gray-800">
                                <strong>{request.memberName}</strong> ({request.memberSpecialty}) solicitou para fazer
                                parte desta equipe.
                              </p>
                            </td>
                            <td className="p-2 border-r border-gray-200 text-center" style={{ width: "60px" }}>
                              <Button
                                variant="ghost"
                                className="rounded-full p-2 hover:bg-red-100"
                                onClick={() => handleRequestAction(request.teamId, request.id, "reject")}
                              >
                                <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors">
                                  <X className="h-6 w-6" />
                                </div>
                              </Button>
                            </td>
                            <td className="p-2 text-center" style={{ width: "60px" }}>
                              <Button
                                variant="ghost"
                                className="rounded-full p-2 hover:bg-green-100"
                                onClick={() => handleRequestAction(request.teamId, request.id, "accept")}
                              >
                                <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-600 transition-colors">
                                  <Check className="h-6 w-6" />
                                </div>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>Nenhuma solicitação pendente para esta equipe.</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {selectedTeam.ehMembro && (
                  <>
                    <Button variant="outline" className="flex items-center justify-center gap-2 bg-transparent">
                      <UserMinus className="h-4 w-4" />
                      Sair da equipe
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2 bg-transparent">
                      <BellOff className="h-4 w-4" />
                      Silenciar notificações
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}
