"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Search, Check, X, ClipboardList, Users, ArrowLeft, Map, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

type SectionType = "agendamentos" | "inclusao-exclusao" | "outro" | null

// Tipos para o mapa preliminar
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
type Lateralidade = "N/A" | "DIREITO" | "ESQUERDO" | "BILATERAL"

interface ProcedimentoMapa {
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

export default function AnalisarSolicitacoes() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState<SectionType>(null)
  const [processedSolicitations, setProcessedSolicitations] = useState<number[]>([])
  const [showMapaPreview, setShowMapaPreview] = useState(false)
  const [selectedAgendamento, setSelectedAgendamento] = useState<any>(null)

  // Dados simulados para agendamentos
  const agendamentos = [
    {
      data: "15/09",
      dataCompleta: "15/09/2025",
      procedimento: "COLECISTECTOMIA VIDEOLAPAROSCÓPICA",
      equipe: "DR. RICARDO SALLES",
      paciente: "JOSÉ DA SILVA",
    },
    {
      data: "22/10",
      dataCompleta: "22/10/2025",
      procedimento: "HISTERECTOMIA VIDEOLAPAROSCÓPICA",
      equipe: "DRA. LÚCIA ANDRADE",
      paciente: "MARIA SANTOS",
    },
    {
      data: "08/11",
      dataCompleta: "08/11/2025",
      procedimento: "HERNIORRAFIA INGUINAL BILATERAL",
      equipe: "DR. JOSÉ AUGUSTO",
      paciente: "CARLOS OLIVEIRA",
    },
  ]

  // Dados simulados para inclusão/exclusão
  const solicitacoesEquipe = [
    {
      nome: "DR. PEDRO FILGUEIRAS",
      especialidade: "ANESTESIOLOGISTA",
      tipo: "inclusão",
      equipe: "DR. MARCOS FREITAS",
      especialidadeEquipe: "ORTOPEDIA",
    },
    {
      nome: "MARCELA ALVES",
      especialidade: "INSTRUMENTADORA",
      tipo: "inclusão",
      equipe: "DR. MARCOS FREITAS",
      especialidadeEquipe: "ORTOPEDIA",
    },
    {
      nome: "DR. RODRIGO RIBEIRO",
      especialidade: "CIRURGIÃO",
      tipo: "inclusão",
      equipe: "DRA. JOYCE SILVA",
      especialidadeEquipe: "CIRURGIA PLÁSTICA",
    },
    {
      nome: "DRA. ROBERTA MOTA",
      especialidade: "CIRURGIA GERAL",
      tipo: "exclusão",
      equipe: "DR. MARCELO BASTOS",
      especialidadeEquipe: "CIRURGIA GERAL",
    },
    {
      nome: "ENF. CARLA SANTOS",
      especialidade: "ENFERMEIRA",
      tipo: "inclusão",
      equipe: "DRA. ANA PAULA",
      especialidadeEquipe: "GINECOLOGIA",
    },
  ]

  // Dados simulados para pré-agendamento
  const preAgendamento = {
    equipe: "DR. JOSÉ AUGUSTO",
    nome: "JOSÉ DA SILVA",
    idade: 54,
    sexo: "MASCULINO",
    data: "10/05 (11/05 ou 17/05)",
    procedimento: "COLECISTECTOMIA VIDEOLAPAROSCÓPICA - 31005497",
    lateralidade: "NÃO SE APLICA",
    convenio: "BRADESCO SAÚDE",
  }

  // Dados simulados para o mapa preliminar
  const getMapaPreviewData = (data: string): ProcedimentoMapa[] => {
    const baseData: ProcedimentoMapa[] = [
      {
        status: "EM ANDAMENTO",
        sala: 1,
        horario: "08:00",
        paciente: selectedAgendamento?.paciente || "JOSÉ DA SILVA",
        idade: 54,
        procedimento: selectedAgendamento?.procedimento || "COLECISTECTOMIA VIDEOLAPAROSCÓPICA",
        lateralidade: "N/A",
        cirurgiao: selectedAgendamento?.equipe || "DR. RICARDO SALLES",
        convenio: "BRADESCO",
      },
      {
        status: "CHAMADO",
        sala: 2,
        horario: "09:30",
        paciente: "Maria Santos Silva",
        idade: 45,
        procedimento: "HERNIORRAFIA INGUINAL",
        lateralidade: "DIREITO",
        cirurgiao: "DR. CARLOS MENDES",
        convenio: "UNIMED",
      },
      {
        status: "RECEPÇÃO",
        sala: 3,
        horario: "10:00",
        paciente: "Pedro Oliveira Costa",
        idade: 62,
        procedimento: "FACOEMULSIFICAÇÃO",
        lateralidade: "ESQUERDO",
        cirurgiao: "DRA. ANA PAULA",
        convenio: "SULAMÉRICA",
      },
    ]
    return baseData
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
  }

  // Função para fazer logout
  const handleHome = () => {
    router.push("/tela-operador")
  }

  // Função para navegar para o mapa do dia
  const irParaMapaDoDia = () => {
    router.push("/mapa-cirurgico")
  }

  // Função para aprovar ou rejeitar solicitação
  const handleSolicitacao = (index: number, aprovado: boolean) => {
    setProcessedSolicitations((prev) => [...prev, index])

    const solicitacao = solicitacoesEquipe[index]
    const acao = aprovado ? "aprovada" : "rejeitada"

    toast({
      title: `Solicitação ${acao}`,
      description: `A solicitação de ${solicitacao.tipo} de ${solicitacao.nome} foi ${acao} com sucesso.`,
    })
  }

  // Função para confirmar agendamento
  const handleConfirmarAgendamento = () => {
    toast({
      title: "Agendamento confirmado",
      description: "O agendamento foi confirmado com sucesso.",
    })
  }

  // Função para enviar pré-agendamento
  const handleEnviarPreAgendamento = () => {
    toast({
      title: "Pré-agendamento enviado",
      description: "O pré-agendamento foi enviado para o usuário.",
    })
  }

  // Função para abrir mapa preliminar
  const handleMapaPreview = () => {
    setShowMapaPreview(true)
  }

  // Função para clicar em linha de agendamento
  const handleAgendamentoClick = (agendamento: any) => {
    setSelectedAgendamento(agendamento)
    setActiveSection("outro")
  }

  // Filtrar solicitações não processadas
  const solicitacoesAtivas = solicitacoesEquipe.filter((_, index) => !processedSolicitations.includes(index))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <header className="w-full bg-[#1E40AF] py-3 px-4 flex justify-between items-center text-white shadow-md">
        <h1 className="text-lg md:text-xl font-medium">Análise de Solicitações</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base">Enfermeiro(a) Luciano</span>
          <Button variant="ghost" size="sm" onClick={irParaMapaDoDia} className="text-white hover:bg-blue-700">
            <Map className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Mapa do Dia</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleHome} className="text-white hover:bg-blue-700">
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:p-10 bg-gray-100">
        {/* Botões principais */}
        {!activeSection && (
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Solicitações</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    className="w-full h-48 flex flex-col justify-center items-center bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-md relative"
                    onClick={() => setActiveSection("agendamentos")}
                  >
                    <ClipboardList className="h-8 w-8 mb-2" />
                    <span>Agendamento de procedimentos</span>
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      3
                    </span>
                  </Button>

                  <Button
                    className="w-full h-48 flex flex-col justify-center items-center bg-[#1E40AF] hover:bg-blue-700 text-white font-bold rounded-md relative"
                    onClick={() => setActiveSection("inclusao-exclusao")}
                  >
                    <Users className="h-8 w-8 mb-2" />
                    <span>Inclusão/Exclusão de Membros</span>
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      {solicitacoesAtivas.length}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Seção de Agendamentos */}
        {activeSection === "agendamentos" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => setActiveSection(null)} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>

            <Card className="shadow-md">
              <CardHeader className="bg-[#1E40AF] text-white">
                <CardTitle className="text-center text-xl font-bold">AGENDAMENTOS</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Filtros */}
                <div className="mb-8 flex flex-wrap items-center gap-4">
                  <div className="font-bold">Filtrar por:</div>

                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
                      <label className="font-bold min-w-16">DATA</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15-09">15/09</SelectItem>
                          <SelectItem value="22-10">22/10</SelectItem>
                          <SelectItem value="08-11">08/11</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
                      <label className="font-bold min-w-16">EQUIPE</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ricardo">DR. RICARDO SALLES</SelectItem>
                          <SelectItem value="lucia">DRA. LÚCIA ANDRADE</SelectItem>
                          <SelectItem value="jose">DR. JOSÉ AUGUSTO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
                      <label className="font-bold min-w-32">PROCEDIMENTO</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="colecistectomia">COLECISTECTOMIA</SelectItem>
                          <SelectItem value="histerectomia">HISTERECTOMIA</SelectItem>
                          <SelectItem value="herniorrafia">HERNIORRAFIA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="p-2 bg-transparent hover:bg-gray-200 text-black">
                    <Search className="h-6 w-6" />
                  </Button>
                </div>

                {/* Tabela de Agendamentos */}
                <div className="border border-gray-300 rounded-sm overflow-hidden">
                  <div className="grid grid-cols-12 bg-[#1E40AF] text-white font-bold text-center">
                    <div className="col-span-2 p-3 border-r border-blue-600">DATA</div>
                    <div className="col-span-6 p-3 border-r border-blue-600">PROCEDIMENTO</div>
                    <div className="col-span-4 p-3">EQUIPE</div>
                  </div>

                  {agendamentos.map((agendamento, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 border-t border-gray-300 hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleAgendamentoClick(agendamento)}
                    >
                      <div className="col-span-2 p-3 border-r border-gray-300 text-center">{agendamento.data}</div>
                      <div className="col-span-6 p-3 border-r border-gray-300">{agendamento.procedimento}</div>
                      <div className="col-span-4 p-3 text-center">{agendamento.equipe}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Seção de Pré-Agendamento */}
        {activeSection === "outro" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => setActiveSection("agendamentos")} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>

            <Card className="shadow-md">
              <CardHeader className="bg-[#1E40AF] text-white">
                <CardTitle className="text-center text-xl font-bold">PRÉ-AGENDAMENTO</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Card className="border border-gray-300">
                  <CardHeader>
                    <CardTitle className="text-center text-lg">
                      EQUIPE: {selectedAgendamento?.equipe || preAgendamento.equipe}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="font-bold">
                          NOME:{" "}
                          <span className="font-normal">{selectedAgendamento?.paciente || preAgendamento.nome}</span>
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">
                          IDADE: <span className="font-normal">{preAgendamento.idade}</span>
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">
                          SEXO: <span className="font-normal">{preAgendamento.sexo}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="font-bold">DATA:</p>
                        <p className="font-normal">{selectedAgendamento?.dataCompleta || preAgendamento.data}</p>
                        <div>
                          <p className="text-sm font-bold">Confirma/sugerir outra data</p>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10-05">10/05</SelectItem>
                              <SelectItem value="11-05">11/05</SelectItem>
                              <SelectItem value="17-05">17/05</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-bold">PROCEDIMENTO:</p>
                      <p className="font-normal">{selectedAgendamento?.procedimento || preAgendamento.procedimento}</p>
                      <div>
                        <p className="text-sm font-bold">Confirma/corrigir dado</p>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirma">Confirmar</SelectItem>
                            <SelectItem value="corrigir">Corrigir</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="font-bold">LATERALIDADE:</p>
                        <p className="font-normal">{preAgendamento.lateralidade}</p>
                        <div>
                          <p className="text-sm font-bold">Confirma/corrigir dado</p>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirma">Confirmar</SelectItem>
                              <SelectItem value="corrigir">Corrigir</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold">CONVÊNIO:</p>
                        <p className="font-normal">{preAgendamento.convenio}</p>
                        <div>
                          <p className="text-sm font-bold">Confirma/corrigir dado</p>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirma">Confirmar</SelectItem>
                              <SelectItem value="corrigir">Corrigir</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Button
                    className="py-6 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold text-lg"
                    onClick={handleConfirmarAgendamento}
                  >
                    CONFIRMAR AGENDAMENTO
                  </Button>

                  <Button
                    className="py-6 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold text-lg"
                    onClick={handleEnviarPreAgendamento}
                  >
                    ENVIAR PRÉ-AGENDAMENTO
                  </Button>
                </div>

                <div className="mt-8">
                  <Button
                    className="w-full py-6 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold text-lg"
                    onClick={handleMapaPreview}
                  >
                    MAPA PRELIMINAR
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Seção de Inclusão/Exclusão de Membros */}
        {activeSection === "inclusao-exclusao" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => setActiveSection(null)} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-gray-800">
                  Inclusão/Exclusão de Membros de Equipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {solicitacoesAtivas.map((solicitacao, displayIndex) => {
                        const originalIndex = solicitacoesEquipe.findIndex((s) => s === solicitacao)
                        return (
                          <tr key={originalIndex} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="p-4 border-r border-gray-200">
                              <p className="text-gray-800">
                                <strong>{solicitacao.nome}</strong> ({solicitacao.especialidade}){" "}
                                <strong>solicitou {solicitacao.tipo}</strong> na equipe {solicitacao.equipe} (
                                {solicitacao.especialidadeEquipe})
                              </p>
                            </td>
                            <td className="p-2 border-r border-gray-200 text-center" style={{ width: "60px" }}>
                              <Button
                                variant="ghost"
                                className="rounded-full p-2 hover:bg-red-100"
                                onClick={() => handleSolicitacao(originalIndex, false)}
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
                                onClick={() => handleSolicitacao(originalIndex, true)}
                              >
                                <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-600 transition-colors">
                                  <Check className="h-6 w-6" />
                                </div>
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {solicitacoesAtivas.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">Todas as solicitações foram processadas!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Modal do Mapa Preliminar */}
      <Dialog open={showMapaPreview} onOpenChange={setShowMapaPreview}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              MAPA CIRÚRGICO PRELIMINAR - {selectedAgendamento?.dataCompleta || "15/09/2025"}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <Card className="shadow-md">
              <CardHeader className="bg-white border-b pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="text-xl font-bold">
                    Visualização Preliminar - {selectedAgendamento?.dataCompleta || "15/09/2025"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input type="search" placeholder="Buscar..." className="pl-9 w-full md:w-[250px]" />
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
                        <th className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span>STATUS</span>
                            <ChevronDown size={16} />
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span>SALA</span>
                            <ChevronDown size={16} />
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span>HORÁRIO</span>
                            <ChevronDown size={16} />
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span>PACIENTE</span>
                            <ChevronDown size={16} />
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span>IDADE</span>
                            <ChevronDown size={16} />
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span>PROCEDIMENTO</span>
                            <ChevronDown size={16} />
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span>LATERALIDADE</span>
                            <ChevronDown size={16} />
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span>CIRURGIÃO</span>
                            <ChevronDown size={16} />
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span>CONVÊNIO</span>
                            <ChevronDown size={16} />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getMapaPreviewData(selectedAgendamento?.dataCompleta || "15/09/2025").map((proc, index) => (
                        <tr
                          key={index}
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
                          <td className="py-3 px-4">{proc.convenio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}
