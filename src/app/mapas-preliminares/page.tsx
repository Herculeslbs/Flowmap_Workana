"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, ChevronDown, Search, Filter, AlertCircle, ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, addDays, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"

// Tipos para os dados da tabela
type Status = "AGENDADO" | "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "REAGENDADO" | "EM AVALIAÇÃO" | "PRÉ-AGENDADO"

type Lateralidade = "N/A" | "DIREITO" | "ESQUERDO" | "BILATERAL"

interface ProcedimentoPreliminar {
  id: string
  status: Status
  data: string // Data do procedimento
  sala: number
  horario: string
  paciente: string
  idade: number
  procedimento: string
  lateralidade: Lateralidade
  cirurgiao: string
  convenio: string
}

// Cores para os diferentes status preliminares
const statusColors: Record<Status, string> = {
  AGENDADO: "bg-blue-500 text-white",
  PENDENTE: "bg-yellow-500 text-white",
  CONFIRMADO: "bg-green-500 text-white",
  CANCELADO: "bg-red-500 text-white",
  REAGENDADO: "bg-orange-500 text-white",
  "EM AVALIAÇÃO": "bg-purple-500 text-white",
  "PRÉ-AGENDADO": "bg-cyan-500 text-white",
}

// Dados fictícios para procedimentos futuros
const futureProcedures: ProcedimentoPreliminar[] = [
  {
    id: "fp-001",
    status: "AGENDADO",
    data: format(addDays(new Date(), 1), "dd/MM/yyyy"), // Amanhã
    sala: 1,
    horario: "08:00",
    paciente: "Ana Clara Souza",
    idade: 30,
    procedimento: "Apêndicectomia",
    lateralidade: "N/A",
    cirurgiao: "Dr. João Silva",
    convenio: "UNIMED",
  },
  {
    id: "fp-002",
    status: "PRÉ-AGENDADO",
    data: format(addDays(new Date(), 1), "dd/MM/yyyy"), // Amanhã
    sala: 2,
    horario: "10:00",
    paciente: "Bruno Fernandes",
    idade: 55,
    procedimento: "Colecistectomia",
    lateralidade: "N/A",
    cirurgiao: "Dra. Maria Oliveira",
    convenio: "BRADESCO",
  },
  {
    id: "fp-003",
    status: "AGENDADO",
    data: format(addDays(new Date(), 2), "dd/MM/yyyy"), // Depois de amanhã
    sala: 1,
    horario: "09:00",
    paciente: "Carla Dias",
    idade: 40,
    procedimento: "Herniorrafia Inguinal",
    lateralidade: "DIREITO",
    cirurgiao: "Dr. Pedro Costa",
    convenio: "SULAMÉRICA",
  },
  {
    id: "fp-004",
    status: "PENDENTE",
    data: format(addDays(new Date(), 3), "dd/MM/yyyy"), // Daqui a 3 dias
    sala: 3,
    horario: "11:00",
    paciente: "Daniela Lima",
    idade: 28,
    procedimento: "Rinoplastia",
    lateralidade: "N/A",
    cirurgiao: "Dra. Laura Mendes",
    convenio: "PARTICULAR",
  },
  {
    id: "fp-005",
    status: "CONFIRMADO",
    data: format(addDays(new Date(), 4), "dd/MM/yyyy"), // Daqui a 4 dias
    sala: 2,
    horario: "14:00",
    paciente: "Eduardo Rocha",
    idade: 60,
    procedimento: "Artroplastia de Joelho",
    lateralidade: "ESQUERDO",
    cirurgiao: "Dr. Fernando Alves",
    convenio: "UNIMED",
  },
]

export default function MapasPreliminares() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  const handleHome = () => {
    router.push("/tela-operador")
  }

  const irParaGerenciarMapa = () => {
    router.push("/gerenciar-mapa")
  }

  const handlePreviousDay = () => {
    setCurrentDate((prev) => subDays(prev, 1))
  }

  const handleNextDay = () => {
    setCurrentDate((prev) => addDays(prev, 1))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date)
      setIsCalendarOpen(false)
    }
  }

  const procedimentosFiltrados = futureProcedures
    .filter((proc) => proc.data === format(currentDate, "dd/MM/yyyy"))
    .filter((proc) =>
      searchTerm
        ? proc.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proc.cirurgiao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proc.procedimento.toLowerCase().includes(searchTerm.toLowerCase())
        : true,
    )

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

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
          AGENDADO: 1,
          "PRÉ-AGENDADO": 2,
          PENDENTE: 3,
          CONFIRMADO: 4,
          REAGENDADO: 5,
          CANCELADO: 6,
          "EM AVALIAÇÃO": 7,
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <header className="w-full bg-[#1E40AF] py-3 px-4 flex justify-between items-center text-white shadow-md">
        <h1 className="text-lg md:text-xl font-medium">Mapas Cirúrgicos Preliminares</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base">Enfermeiro(a) Luciano</span>
          <Button variant="ghost" size="sm" onClick={irParaGerenciarMapa} className="text-white hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleHome} className="text-white hover:bg-blue-700">
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:p-10 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-md">
            <CardHeader className="bg-white border-b pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="text-2xl font-bold flex items-center gap-4">
                  Mapa Preliminar - {formattedDate}
                </CardTitle>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handlePreviousDay}>
                    Anterior
                  </Button>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Calendar className="h-4 w-4" />
                        {format(currentDate, "dd/MM/yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={currentDate}
                        onSelect={handleDateSelect}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline" onClick={handleNextDay}>
                    Próximo
                  </Button>
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
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-800 text-white">
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
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProcedimentos.length > 0 ? (
                      sortedProcedimentos.map((proc, index) => (
                        <tr
                          key={proc.id}
                          className={`hover:bg-gray-100 ${proc.sala % 2 === 1 ? "bg-[#EFF6FF]" : "bg-white"}`}
                        >
                          <td className="py-3 px-4">
                            <Badge className={`${statusColors[proc.status]} font-normal`}>{proc.status}</Badge>
                          </td>
                          <td className="py-3 px-4 text-center">{proc.sala}</td>
                          <td className="py-3 px-4">{proc.horario}</td>
                          <td className="py-3 px-4">{proc.paciente}</td>
                          <td className="py-3 px-4 text-center">{proc.idade}</td>
                          <td className="py-3 px-4">{proc.procedimento}</td>
                          <td className="py-3 px-4 text-center">{proc.lateralidade}</td>
                          <td className="py-3 px-4">{proc.cirurgiao}</td>
                          <td className="py-3 px-4 max-w-[150px] truncate">{proc.convenio}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle className="h-8 w-8 mb-2" />
                            <p>Nenhum procedimento encontrado para esta data.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
