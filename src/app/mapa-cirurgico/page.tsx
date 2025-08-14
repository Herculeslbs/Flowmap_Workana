"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Search, Filter, Calendar, Users, PlusCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import NotificationButton from "../notification-button/page";

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

// Dados fictícios para a tabela
const procedimentos: Procedimento[] = [
  {
    status: "SRPA",
    sala: 1,
    horario: "07:30",
    paciente: "João Batista Moreira",
    idade: 45,
    procedimento: "Herniorrafia Inguinal",
    lateralidade: "DIREITO",
    cirurgiao: "Dr. Ricardo Salles",
    convenio: "UNIMED",
  },
  {
    status: "CHAMADO",
    sala: 1,
    horario: "10:00",
    paciente: "Fabiana Lopes Martins",
    idade: 54,
    procedimento: "Colecistectomia Videolaparosc.",
    lateralidade: "N/A",
    cirurgiao: "Dra. Ricardo Salles",
    convenio: "BRADESCO",
  },
  {
    status: "RECEPÇÃO",
    sala: 1,
    horario: "13:00",
    paciente: "Jonas Pedroso Carvalho",
    idade: 72,
    procedimento: "Histerectomia Vaginal",
    lateralidade: "N/A",
    cirurgiao: "Dr. Fábio Moura",
    convenio: "GOLDEN",
  },
  {
    status: "EXTERNO",
    sala: 1,
    horario: "16:30",
    paciente: "Raquel Lima Andrade",
    idade: 47,
    procedimento: "Varizes Membros Inferiores",
    lateralidade: "BILATERAL",
    cirurgiao: "Dra. Letícia Noronha",
    convenio: "PARTICULAR",
  },
  {
    status: "EM ANDAMENTO",
    sala: 2,
    horario: "07:30",
    paciente: "Luís Carlos Damasceno",
    idade: 68,
    procedimento: "Prostatectomia Radical Robótica",
    lateralidade: "N/A",
    cirurgiao: "Dr. Daniel Tavares",
    convenio: "UNIMED",
  },
  {
    status: "APO",
    sala: 2,
    horario: "13:00",
    paciente: "Márcia Soares Ribeiro",
    idade: 59,
    procedimento: "Facoemulsificação",
    lateralidade: "DIREITO",
    cirurgiao: "Dra. Carolina Paes",
    convenio: "SULAMÉRICA",
  },
  {
    status: "QUARTO",
    sala: 2,
    horario: "14:00",
    paciente: "Maria Pinto Fagundes",
    idade: 41,
    procedimento: "Laqueadura Tubária",
    lateralidade: "N/A",
    cirurgiao: "Dr. Gustavo Vidal",
    convenio: "BRADESCO",
  },
  {
    status: "EXTERNO",
    sala: 2,
    horario: "16:00",
    paciente: "Eliane de Castro Ferreira",
    idade: 66,
    procedimento: "Histeroscopia Diagnóstica",
    lateralidade: "N/A",
    cirurgiao: "Dr. Gustavo Vidal",
    convenio: "FUSEX",
  },
  {
    status: "ALTA",
    sala: 3,
    horario: "08:00",
    paciente: "Jorge Almeida Rocha",
    idade: 50,
    procedimento: "Nefrolitotripsia Flexível",
    lateralidade: "DIREITO",
    cirurgiao: "Dr. Leonardo S. Dias",
    convenio: "UNIMED",
  },
  {
    status: "EM ANDAMENTO",
    sala: 3,
    horario: "09:30",
    paciente: "Simone Meirelles Dutra",
    idade: 37,
    procedimento: "Colecistectomia Videolaparosc.",
    lateralidade: "N/A",
    cirurgiao: "Dr. Eduardo Ramos",
    convenio: "PARTICULAR",
  },
  {
    status: "CHAMADO",
    sala: 3,
    horario: "11:30",
    paciente: "Nelson Garcia Teixeira",
    idade: 41,
    procedimento: "By-pass gástrico",
    lateralidade: "N/A",
    cirurgiao: "Dr. Eduardo Ramos",
    convenio: "CASSI",
  },
  {
    status: "SUSPENSA",
    sala: 3,
    horario: "15:00",
    paciente: "Roberta Soares Silveira",
    idade: 34,
    procedimento: "Artroscopia de Joelho",
    lateralidade: "ESQUERDO",
    cirurgiao: "Dra. Fernanda C. Luz",
    convenio: "BRADESCO",
  },
  {
    status: "SRPA",
    sala: 4,
    horario: "07:30",
    paciente: "Otávio Marques Gonçalves",
    idade: 64,
    procedimento: "Osteossíntese de Úmero",
    lateralidade: "DIREITO",
    cirurgiao: "Dr. Carlos H. Bittencourt",
    convenio: "GOLDEN",
  },
  {
    status: "EM ANDAMENTO",
    sala: 4,
    horario: "10:00",
    paciente: "Beatriz Antunes Ferreira",
    idade: 25,
    procedimento: "Artroplastia de quadril",
    lateralidade: "DIREITO",
    cirurgiao: "Dr. Carlos H. Bittencourt",
    convenio: "UNIMED",
  },
  {
    status: "APO",
    sala: 4,
    horario: "14:00",
    paciente: "Pedro Vitor Saldanha",
    idade: 39,
    procedimento: "Cirurgia de Hemorroida",
    lateralidade: "N/A",
    cirurgiao: "Dr. Álvaro Gonçalves",
    convenio: "AMIL",
  },
  {
    status: "CTI",
    sala: 4,
    horario: "16:00",
    paciente: "Elza Maria Coimbra",
    idade: 73,
    procedimento: "Reconstrução de Parede Abdominal",
    lateralidade: "N/A",
    cirurgiao: "Dra. Patrícia Fontes",
    convenio: "UNIMED",
  },
  {
    status: "EM ANDAMENTO",
    sala: 5,
    horario: "08:00",
    paciente: "Bruno César Machado",
    idade: 22,
    procedimento: "Orquiectomia",
    lateralidade: "ESQUERDO",
    cirurgiao: "Dr. Henrique de Sá",
    convenio: "SULAMÉRICA",
  },
  {
    status: "CHAMADO",
    sala: 5,
    horario: "10:00",
    paciente: "Luciana Esteves Paiva",
    idade: 36,
    procedimento: "Histerectomia Videolaparoscópica",
    lateralidade: "N/A",
    cirurgiao: "Dra. Lúcia Andrade",
    convenio: "BRADESCO",
  },
  {
    status: "APO",
    sala: 5,
    horario: "13:00",
    paciente: "Edson Alves Guimarães",
    idade: 53,
    procedimento: "Vasectomia",
    lateralidade: "N/A",
    cirurgiao: "Dr. André Peixoto",
    convenio: "UNIMED",
  },
  {
    status: "RECEPÇÃO",
    sala: 5,
    horario: "15:00",
    paciente: "Carlos Maia Marcondes",
    idade: 61,
    procedimento: "Vasectomia",
    lateralidade: "N/A",
    cirurgiao: "Dr. André Peixoto",
    convenio: "AMIL",
  },
]

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

export default function MapaCirurgico() {
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
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

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
    // Aqui seria implementada a lógica de logout (limpar tokens, etc)
    router.push("/home")
  }

  const toggleRowExpansion = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index)
  }

  // Função para ordenar procedimentos
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Se já estiver ordenando por este campo, inverte a direção
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Se for um novo campo, define o campo e a direção padrão (asc)
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Ordenar procedimentos
  const sortedProcedimentos = [...procedimentosFiltrados].sort((a, b) => {
    if (!sortField) return 0

    let fieldA: any
    let fieldB: any

    // Tratamento especial para diferentes tipos de campos
    switch (sortField) {
      case "paciente":
      case "cirurgiao":
      case "convenio":
      case "procedimento":
        // Ordenação alfabética (case-insensitive)
        fieldA = a[sortField as keyof typeof a].toString().toLowerCase()
        fieldB = b[sortField as keyof typeof b].toString().toLowerCase()
        break
      case "sala":
      case "idade":
        // Ordenação numérica
        fieldA = Number(a[sortField as keyof typeof a])
        fieldB = Number(b[sortField as keyof typeof b])
        break
      case "horario":
        // Ordenação por horário (convertendo para minutos)
        const timeToMinutes = (time: string) => {
          const [hours, minutes] = time.split(":").map(Number)
          return hours * 60 + minutes
        }
        fieldA = timeToMinutes(a.horario)
        fieldB = timeToMinutes(b.horario)
        break
      case "status":
        // Ordenação por status com prioridade específica
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
        // Ordenação por lateralidade
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
    <div className="w-full h-full flex justify-center items-center p-3">
      <Card className="shadow-md">
        <CardHeader className="bg-white border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-4">
              MAPA CIRÚRGICO - {new Date().toLocaleDateString("pt-BR")}
              <NotificationButton />
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
                </tr>
              </thead>
              <tbody>
                {sortedProcedimentos.length > 0 ? (
                  sortedProcedimentos.map((proc, index) => (
                    <tr
                      key={index}
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
                            href={`/painel-paciente1`}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={visibleColumns.length} className="py-8 text-center text-gray-500">
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
                <div key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleRowExpansion(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <Badge className={`${statusColors[proc.status]} font-normal`}>{proc.status}</Badge>
                      <div className="text-sm">
                        <div className="font-medium">
                          <Link
                            href={`/paciente/${index}`}
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

        <div className="p-6 border-t bg-white flex flex-wrap justify-center gap-3">
          <Link href="/por-sala">
            <Button className="bg-blue-800 hover:bg-blue-700 text-white">
              <Calendar className="mr-2 h-4 w-4" />
              Todas em Andamento
            </Button>
          </Link>
          <Link href="/equipes-cirurgicas">
            <Button className="bg-blue-800 hover:bg-blue-700 text-white">
              <Users className="mr-2 h-4 w-4" />
              Equipes Cirúrgicas
            </Button>
          </Link>
          <Link href="/agendar-procedimentos">
            <Button className="bg-blue-800 hover:bg-blue-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agendar Procedimentos
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}