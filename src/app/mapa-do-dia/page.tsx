"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Search, Filter, PlusCircle, AlertCircle, LogOut, Map, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { getAllPacientes } from "@/lib/pacientes-data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Hook personalizado para media queries
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [matches, query])

  return matches
}

// Tipos para os dados da tabela
type Status =
  | "ALTA"
  | "INTERNAÇÃO"
  | "EXTERNO"
  | "CHAMADO"
  | "SUSPENSA"
  | "SRPA"
  | "QUARTO"
  | "ENFERMARIA"
  | "EM ANDAMENTO"
  | "CTI"
  | "RECEPÇÃO"
  | "APO"
  | "OUTRO"

type Lateralidade = "N/A" | "DIREITO" | "ESQUERDO" | "BILATERAL"

interface Procedimento {
  id: string
  status: Status
  sala: number
  horario: string
  paciente: string
  idade: number
  procedimento: string
  lateralidade: Lateralidade
  cirurgiao: string
  convenio: string
}

// Cores para os diferentes status
const statusColors: Record<Status, string> = {
  ALTA: "bg-green-500 text-white",
  INTERNAÇÃO: "bg-yellow-100 text-black border border-yellow-500",
  EXTERNO: "bg-gray-400 text-white",
  CHAMADO: "bg-red-600 text-white",
  SUSPENSA: "bg-orange-500 text-white",
  SRPA: "bg-orange-200 text-black border border-orange-500",
  QUARTO: "bg-blue-200 text-black border border-blue-500",
  ENFERMARIA: "bg-green-200 text-black border border-green-500",
  "EM ANDAMENTO": "bg-green-600 text-white",
  CTI: "bg-amber-800 text-white",
  RECEPÇÃO: "bg-purple-200 text-black border border-purple-500",
  APO: "bg-cyan-200 text-black border border-cyan-500",
  OUTRO: "bg-gray-300 text-black border border-gray-400",
}

export default function MapaDoDia() {
  const [filtroSala, setFiltroSala] = useState<number | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "status",
    "sala",
    "horario",
    "paciente",
    "idade",
    "procedimento",
    "lateralidade",
    "cirurgiao",
    "convenio",
  ])
  const router = useRouter()
  const { toast } = useToast()
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showAddUrgencyDialog, setShowAddUrgencyDialog] = useState(false)
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false)
  const [procedureToDelete, setProcedureToDelete] = useState<string | null>(null)

  // Estado para os dados do formulário de urgência
  const [newProcedureData, setNewProcedureData] = useState({
    paciente: "",
    idade: "",
    procedimento: "",
    sala: "",
    cirurgiao: "",
    convenio: "",
    lateralidade: "N/A",
    horario: "",
  })

  // Inicializa procedimentos com dados do lib e permite mutação
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>(() => {
    const pacientesCompletos = getAllPacientes()
    return pacientesCompletos.map((paciente) => ({
      id: paciente.id,
      status: paciente.status as Status,
      sala: paciente.sala,
      horario: "07:30", // Horário padrão - pode ser extraído dos horários do paciente
      paciente: paciente.nome,
      idade: paciente.idade,
      procedimento: paciente.procedimento,
      lateralidade: paciente.lateralidade as Lateralidade,
      cirurgiao: paciente.cirurgiao,
      convenio: paciente.convenio,
    }))
  })

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")

  // Ajusta colunas visíveis com base no tamanho da tela
  useEffect(() => {
    if (isMobile) {
      setVisibleColumns(["status", "sala", "horario", "paciente"])
    } else if (isTablet) {
      setVisibleColumns(["status", "sala", "horario", "paciente", "idade", "procedimento"])
    } else {
      setVisibleColumns([
        "status",
        "sala",
        "horario",
        "paciente",
        "idade",
        "procedimento",
        "lateralidade",
        "cirurgiao",
        "convenio",
      ])
    }
  }, [isMobile, isTablet])

  const procedimentosFiltrados = procedimentos
    .filter((proc) => (filtroSala ? proc.sala === filtroSala : true))
    .filter((proc) =>
      searchTerm
        ? proc.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proc.cirurgiao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proc.procedimento.toLowerCase().includes(searchTerm.toLowerCase())
        : true,
    )

  // Função para fazer logout
  const handleLogout = () => {
    router.push("/home")
  }

  const toggleRowExpansion = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index)
  }

  // Função para ordenar procedimentos
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Ordenar procedimentos
  const sortedProcedimentos = [...procedimentosFiltrados].sort((a, b) => {
    if (!sortField) return 0

    let fieldA: any
    let fieldB: any

    switch (sortField) {
      case "paciente":
      case "cirurgiao":
      case "convenio":
      case "procedimento":
        fieldA = a[sortField as keyof typeof a].toString().toLowerCase()
        fieldB = b[sortField as keyof typeof b].toString().toLowerCase()
        break
      case "sala":
      case "idade":
        fieldA = Number(a[sortField as keyof typeof a])
        fieldB = Number(b[sortField as keyof typeof b])
        break
      case "horario":
        const timeToMinutes = (time: string) => {
          const [hours, minutes] = time.split(":").map(Number)
          return hours * 60 + minutes
        }
        fieldA = timeToMinutes(a.horario)
        fieldB = timeToMinutes(b.horario)
        break
      case "status":
        const statusPriority: Record<Status, number> = {
          "EM ANDAMENTO": 1,
          CHAMADO: 2,
          RECEPÇÃO: 3,
          SRPA: 4,
          APO: 5,
          QUARTO: 6,
          ENFERMARIA: 7,
          ALTA: 8,
          EXTERNO: 9,
          CTI: 10,
          SUSPENSA: 11,
          INTERNAÇÃO: 12,
          OUTRO: 13,
        }
        fieldA = statusPriority[a.status] || 99
        fieldB = statusPriority[b.status] || 99
        break
      case "lateralidade":
        const lateralidadePriority: Record<Lateralidade, number> = {
          DIREITO: 1,
          ESQUERDO: 2,
          BILATERAL: 3,
          "N/A": 4,
        }
        fieldA = lateralidadePriority[a.lateralidade] || 99
        fieldB = lateralidadePriority[b.lateralidade] || 99
        break
      default:
        fieldA = a[sortField as keyof typeof a]
        fieldB = b[sortField as keyof typeof b]
    }

    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Função para adicionar procedimento de urgência
  const handleAddUrgencyProcedure = () => {
    const now = new Date()
    const currentHour = now.getHours().toString().padStart(2, "0")
    const currentMinute = now.getMinutes().toString().padStart(2, "0")
    const currentTime = `${currentHour}:${currentMinute}`

    setNewProcedureData({
      paciente: "",
      idade: "",
      procedimento: "",
      sala: "",
      cirurgiao: "",
      convenio: "",
      lateralidade: "N/A",
      horario: currentTime, // Preenche com o horário atual
    })
    setShowAddUrgencyDialog(true)
  }

  const handleSaveUrgencyProcedure = () => {
    if (
      !newProcedureData.paciente ||
      !newProcedureData.procedimento ||
      !newProcedureData.sala ||
      !newProcedureData.cirurgiao ||
      !newProcedureData.horario
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const newId = `urgency-${Date.now()}` // Gerar um ID único
    const newProc: Procedimento = {
      id: newId,
      status: "EM ANDAMENTO", // Status padrão para urgência
      sala: Number.parseInt(newProcedureData.sala),
      horario: newProcedureData.horario,
      paciente: newProcedureData.paciente,
      idade: Number.parseInt(newProcedureData.idade) || 0,
      procedimento: newProcedureData.procedimento,
      lateralidade: newProcedureData.lateralidade as Lateralidade,
      cirurgiao: newProcedureData.cirurgiao,
      convenio: newProcedureData.convenio || "N/A",
    }

    setProcedimentos((prev) => [...prev, newProc])
    setShowAddUrgencyDialog(false)
    toast({
      title: "Procedimento de Urgência Adicionado",
      description: `O procedimento para ${newProcedureData.paciente} foi adicionado com sucesso.`,
    })
  }

  // Função para iniciar a exclusão de um procedimento
  const handleDeleteProcedure = (id: string) => {
    setProcedureToDelete(id)
    setShowConfirmDeleteDialog(true)
  }

  // Função para confirmar a exclusão
  const confirmDeleteProcedure = () => {
    if (procedureToDelete) {
      setProcedimentos((prev) => prev.filter((proc) => proc.id !== procedureToDelete))
      toast({
        title: "Procedimento Excluído",
        description: "O procedimento foi removido do mapa.",
      })
      setProcedureToDelete(null)
      setShowConfirmDeleteDialog(false)
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center p-3">
      <Card className="shadow-md">
        <CardHeader className="bg-white border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-4">
              MAPA DO DIA - {new Date().toLocaleDateString("pt-BR")}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/gerenciar-mapa")}
                className="text-black hover:bg-white"
              >
                <Map className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-black hover:bg-white">
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </CardTitle>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="pl-9 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                <Filter className="h-4 w-4" />
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddUrgencyProcedure}>
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Versão para desktop e tablet */}
          <div className="hidden sm:block w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-800 text-white">
                  {visibleColumns.includes("status") && (
                    <th
                      className="py-3 px-4 text-left whitespace-nowrap cursor-pointer hover:bg-blue-700"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        <span>STATUS</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            sortField === "status" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes("sala") && (
                    <th
                      className="py-3 px-4 text-left whitespace-nowrap cursor-pointer hover:bg-blue-700"
                      onClick={() => handleSort("sala")}
                    >
                      <div className="flex items-center gap-1">
                        <span>SALA</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            sortField === "sala" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes("horario") && (
                    <th
                      className="py-3 px-4 text-left whitespace-nowrap cursor-pointer hover:bg-blue-700"
                      onClick={() => handleSort("horario")}
                    >
                      <div className="flex items-center gap-1">
                        <span>HORÁRIO</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            sortField === "horario" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes("paciente") && (
                    <th
                      className="py-3 px-4 text-left whitespace-nowrap cursor-pointer hover:bg-blue-700"
                      onClick={() => handleSort("paciente")}
                    >
                      <div className="flex items-center gap-1">
                        <span>PACIENTE</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            sortField === "paciente" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes("idade") && (
                    <th
                      className="py-3 px-4 text-left whitespace-nowrap cursor-pointer hover:bg-blue-700"
                      onClick={() => handleSort("idade")}
                    >
                      <div className="flex items-center gap-1">
                        <span>IDADE</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            sortField === "idade" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes("procedimento") && (
                    <th
                      className="py-3 px-4 text-left whitespace-nowrap cursor-pointer hover:bg-blue-700"
                      onClick={() => handleSort("procedimento")}
                    >
                      <div className="flex items-center gap-1">
                        <span>PROCEDIMENTO</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            sortField === "procedimento" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes("lateralidade") && (
                    <th
                      className="py-3 px-4 text-left whitespace-nowrap cursor-pointer hover:bg-blue-700"
                      onClick={() => handleSort("lateralidade")}
                    >
                      <div className="flex items-center gap-1">
                        <span>LATERALIDADE</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            sortField === "lateralidade" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes("cirurgiao") && (
                    <th
                      className="py-3 px-4 text-left whitespace-nowrap cursor-pointer hover:bg-blue-700"
                      onClick={() => handleSort("cirurgiao")}
                    >
                      <div className="flex items-center gap-1">
                        <span>CIRURGIÃO</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            sortField === "cirurgiao" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </th>
                  )}
                  {visibleColumns.includes("convenio") && (
                    <th
                      className="py-3 px-4 text-left whitespace-nowrap cursor-pointer hover:bg-blue-700"
                      onClick={() => handleSort("convenio")}
                    >
                      <div className="flex items-center gap-1">
                        <span>CONVÊNIO</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            sortField === "convenio" && sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </th>
                  )}
                  <th className="py-3 px-4 text-left whitespace-nowrap">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {sortedProcedimentos.length > 0 ? (
                  sortedProcedimentos.map((proc, index) => (
                    <tr
                      key={proc.id}
                      className={`hover:bg-gray-100 ${proc.sala % 2 === 1 ? "bg-[#EFF6FF]" : "bg-white"}`}
                    >
                      {visibleColumns.includes("status") && (
                        <td className="py-3 px-4">
                          <Badge className={`${statusColors[proc.status]} font-normal`}>{proc.status}</Badge>
                        </td>
                      )}
                      {visibleColumns.includes("sala") && <td className="py-3 px-4 text-center">{proc.sala}</td>}
                      {visibleColumns.includes("horario") && <td className="py-3 px-4">{proc.horario}</td>}
                      {visibleColumns.includes("paciente") && (
                        <td className="py-3 px-4">
                          <Link
                            href={`/painel-paciente`}
                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            {proc.paciente}
                          </Link>
                        </td>
                      )}
                      {visibleColumns.includes("idade") && <td className="py-3 px-4 text-center">{proc.idade}</td>}
                      {visibleColumns.includes("procedimento") && <td className="py-3 px-4">{proc.procedimento}</td>}
                      {visibleColumns.includes("lateralidade") && (
                        <td className="py-3 px-4 text-center">{proc.lateralidade}</td>
                      )}
                      {visibleColumns.includes("cirurgiao") && <td className="py-3 px-4">{proc.cirurgiao}</td>}
                      {visibleColumns.includes("convenio") && (
                        <td className="py-3 px-4 max-w-[150px] truncate">{proc.convenio}</td>
                      )}
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-100"
                          onClick={() => handleDeleteProcedure(proc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={visibleColumns.length + 1} className="py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p>Nenhum procedimento encontrado</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Versão para celular */}
          <div className="sm:hidden">
            {sortedProcedimentos.length > 0 ? (
              sortedProcedimentos.map((proc, index) => (
                <div key={proc.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleRowExpansion(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <Badge className={`${statusColors[proc.status]} font-normal`}>{proc.status}</Badge>
                      <div className="text-sm">
                        <div className="font-medium">
                          <Link
                            href={`/painel-paciente`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {proc.paciente}
                          </Link>
                        </div>
                        <div className="text-xs text-gray-500">
                          Sala {proc.sala} • {proc.horario}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${expandedRow === index ? "rotate-180" : ""}`}
                    />
                  </div>

                  {expandedRow === index && (
                    <div className="px-4 pb-4 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500">Idade:</div>
                        <div>{proc.idade}</div>

                        <div className="text-gray-500">Procedimento:</div>
                        <div>{proc.procedimento}</div>

                        <div className="text-gray-500">Lateralidade:</div>
                        <div>{proc.lateralidade}</div>

                        <div className="text-gray-500">Cirurgião:</div>
                        <div>{proc.cirurgiao}</div>

                        <div className="text-gray-500">Convênio:</div>
                        <div>{proc.convenio}</div>
                        <div className="text-gray-500">Ações:</div>
                        <div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-100"
                            onClick={() => handleDeleteProcedure(proc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p>Nenhum procedimento encontrado</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para adicionar cirurgia de urgência */}
      <Dialog open={showAddUrgencyDialog} onOpenChange={setShowAddUrgencyDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Procedimento de Urgência</DialogTitle>
            <DialogDescription>Preencha os dados para adicionar um novo procedimento ao mapa do dia.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paciente" className="text-right">
                Paciente
              </Label>
              <Input
                id="paciente"
                value={newProcedureData.paciente}
                onChange={(e) => setNewProcedureData({ ...newProcedureData, paciente: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="idade" className="text-right">
                Idade
              </Label>
              <Input
                id="idade"
                type="number"
                value={newProcedureData.idade}
                onChange={(e) => setNewProcedureData({ ...newProcedureData, idade: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="procedimento" className="text-right">
                Procedimento
              </Label>
              <Input
                id="procedimento"
                value={newProcedureData.procedimento}
                onChange={(e) => setNewProcedureData({ ...newProcedureData, procedimento: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sala" className="text-right">
                Sala
              </Label>
              <Input
                id="sala"
                type="number"
                value={newProcedureData.sala}
                onChange={(e) => setNewProcedureData({ ...newProcedureData, sala: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cirurgiao" className="text-right">
                Cirurgião
              </Label>
              <Input
                id="cirurgiao"
                value={newProcedureData.cirurgiao}
                onChange={(e) => setNewProcedureData({ ...newProcedureData, cirurgiao: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="convenio" className="text-right">
                Convênio
              </Label>
              <Input
                id="convenio"
                value={newProcedureData.convenio}
                onChange={(e) => setNewProcedureData({ ...newProcedureData, convenio: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lateralidade" className="text-right">
                Lateralidade
              </Label>
              <Select
                value={newProcedureData.lateralidade}
                onValueChange={(value) => setNewProcedureData({ ...newProcedureData, lateralidade: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N/A">N/A</SelectItem>
                  <SelectItem value="DIREITO">DIREITO</SelectItem>
                  <SelectItem value="ESQUERDO">ESQUERDO</SelectItem>
                  <SelectItem value="BILATERAL">BILATERAL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="horario" className="text-right">
                Horário
              </Label>
              <Input
                id="horario"
                type="time"
                value={newProcedureData.horario}
                onChange={(e) => setNewProcedureData({ ...newProcedureData, horario: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUrgencyDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUrgencyProcedure}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={showConfirmDeleteDialog} onOpenChange={setShowConfirmDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este procedimento do mapa? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProcedure}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
