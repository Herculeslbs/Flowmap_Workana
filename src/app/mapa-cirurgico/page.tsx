"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Search, Filter, Calendar, Users, PlusCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// Tipos para os dados da tabela
type Status =
  | "ALTA"
  | "Internação"
  | "Externo"
  | "Chamado"
  | "Suspensa"
  | "SRPA"
  | "Quarto"
  | "Enfermaria"
  | "Em andamento"
  | "CTI"

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
    status: "ALTA",
    sala: 1,
    horario: "07:30",
    paciente: "José Carlos Otero",
    idade: 45,
    procedimento: "CVL",
    lateralidade: "N/A",
    cirurgiao: "DR. ANTONIO",
    convenio: "UNIMED",
  },
  {
    status: "ALTA",
    sala: 1,
    horario: "10:00",
    paciente: "Luzia Marques",
    idade: 66,
    procedimento: "HERNIORRAFIA INGUINAL",
    lateralidade: "DIREITO",
    cirurgiao: "DRA. SUELEN",
    convenio: "BRADESCO",
  },
  {
    status: "Internação",
    sala: 2,
    horario: "09:00",
    paciente: "Davi Macedo Junior",
    idade: 3,
    procedimento: "COLECISTECTOMIA VIDEOLAP",
    lateralidade: "N/A",
    cirurgiao: "DR. RODRIGO",
    convenio: "SULAMÉRICA",
  },
  {
    status: "Externo",
    sala: 1,
    horario: "11:00",
    paciente: "Maria José da Silva",
    idade: 67,
    procedimento: "HISTERECTOMIA VAGINAL",
    lateralidade: "N/A",
    cirurgiao: "DRA. MÁRCIA",
    convenio: "GOLDEN",
  },
  {
    status: "Chamado",
    sala: 1,
    horario: "13:00",
    paciente: "Maria José da Silva",
    idade: 67,
    procedimento: "HISTERECTOMIA VAGINAL",
    lateralidade: "N/A",
    cirurgiao: "DR. JOSÉ CARLOS",
    convenio: "FUSEX",
  },
  {
    status: "Suspensa",
    sala: 2,
    horario: "08:00",
    paciente: "Breno da Cunha Machado",
    idade: 28,
    procedimento: "FRATURA TÍBIA",
    lateralidade: "ESQUERDO",
    cirurgiao: "DR. RODRIGO",
    convenio: "UNIMED",
  },
  {
    status: "SRPA",
    sala: 2,
    horario: "14:00",
    paciente: "Breno da Cunha Machado",
    idade: 28,
    procedimento: "HERNIORRAFIA INGUINAL",
    lateralidade: "DIREITO",
    cirurgiao: "DRA. MARISA",
    convenio: "BRADESCO",
  },
  {
    status: "Em andamento",
    sala: 4,
    horario: "08:30",
    paciente: "Justino Cardoso Lima",
    idade: 72,
    procedimento: "FACO",
    lateralidade: "DIREITO",
    cirurgiao: "DR. LUCIANO",
    convenio: "PARTICULAR",
  },
  {
    status: "Quarto",
    sala: 3,
    horario: "07:30",
    paciente: "Antonio de Almeida Castro",
    idade: 78,
    procedimento: "POSTECTOMIA",
    lateralidade: "N/A",
    cirurgiao: "DR. LUCIANO",
    convenio: "AMIL",
  },
  {
    status: "Enfermaria",
    sala: 3,
    horario: "10:30",
    paciente: "Emanuel de Jesus",
    idade: 55,
    procedimento: "URETEROLITOTOMIA FLEXÍVEL",
    lateralidade: "ESQUERDO",
    cirurgiao: "DRA. MÁRCIA",
    convenio: "UNIMED",
  },
]

// Cores para os diferentes status
const statusColors: Record<Status, string> = {
  ALTA: "bg-green-500 text-white",
  Internação: "bg-yellow-100 text-black border border-yellow-500",
  Externo: "bg-gray-400 text-white",
  Chamado: "bg-red-600 text-white",
  Suspensa: "bg-orange-500 text-white",
  SRPA: "bg-orange-200 text-black border border-orange-500",
  Quarto: "bg-blue-200 text-black border border-blue-500",
  Enfermaria: "bg-green-200 text-black border border-green-500",
  "Em andamento": "bg-green-600 text-white",
  CTI: "bg-amber-800 text-white",
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
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

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

  const toggleRowExpansion = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index)
  }

  return (
    <div className="w-full h-full flex justify-center items-center p-3">
    <Card className="shadow-md">
      <CardHeader className="bg-white border-b pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-bold">Mapa Cirúrgico em Tempo Real</CardTitle>
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
            <Button variant="outline" size="icon" className="h-10 w-10">
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
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>STATUS</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                )}
                {visibleColumns.includes("sala") && (
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>SALA</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                )}
                {visibleColumns.includes("horario") && (
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>HORÁRIO</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                )}
                {visibleColumns.includes("paciente") && (
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>PACIENTE</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                )}
                {visibleColumns.includes("idade") && (
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>IDADE</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                )}
                {visibleColumns.includes("procedimento") && (
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>PROCEDIMENTO</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                )}
                {visibleColumns.includes("lateralidade") && (
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>LATERALIDADE</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                )}
                {visibleColumns.includes("cirurgiao") && (
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>CIRURGIÃO</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                )}
                {visibleColumns.includes("convenio") && (
                  <th className="py-3 px-4 text-left whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>CONVÊNIO</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {procedimentosFiltrados.length > 0 ? (
                procedimentosFiltrados.map((proc, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white hover:bg-gray-100"}>
                    {visibleColumns.includes("status") && (
                      <td className="py-3 px-4">
                        <Badge className={`${statusColors[proc.status]} font-normal`}>{proc.status}</Badge>
                      </td>
                    )}
                    {visibleColumns.includes("sala") && <td className="py-3 px-4 text-center">{proc.sala}</td>}
                    {visibleColumns.includes("horario") && <td className="py-3 px-4">{proc.horario}</td>}
                    {visibleColumns.includes("paciente") && (
                      <td className="py-3 px-4 max-w-[150px] truncate">{proc.paciente}</td>
                    )}
                    {visibleColumns.includes("idade") && <td className="py-3 px-4 text-center">{proc.idade}</td>}
                    {visibleColumns.includes("procedimento") && (
                      <td className="py-3 px-4 max-w-[200px] truncate">{proc.procedimento}</td>
                    )}
                    {visibleColumns.includes("lateralidade") && (
                      <td className="py-3 px-4 text-center">{proc.lateralidade}</td>
                    )}
                    {visibleColumns.includes("cirurgiao") && (
                      <td className="py-3 px-4 max-w-[150px] truncate">{proc.cirurgiao}</td>
                    )}
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
          {procedimentosFiltrados.length > 0 ? (
            procedimentosFiltrados.map((proc, index) => (
              <div key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleRowExpansion(index)}
                >
                  <div className="flex items-center space-x-3">
                    <Badge className={`${statusColors[proc.status]} font-normal`}>{proc.status}</Badge>
                    <div className="text-sm">
                      <div className="font-medium">{proc.paciente}</div>
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
            Exibir por Sala
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
