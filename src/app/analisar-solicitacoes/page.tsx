"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Check, X, ClipboardList, Users, ArrowLeft, Map, ChevronDown, Filter, CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import GlobalHeader from "@/app/global-header/page"

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
    cirurgiaoPrincipal: "Dr. Marcos Motta",
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
    cirurgiaoPrincipal: "Dr. Marcos Motta",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
    membrosList: ["Dr. Pedro Souza", "Dra. Paula Silva", "Dr. João Mendes", "Dr. Roberta Alves"],
  },
  {
    id: 5,
    especialidade: "Cardiologia",
    cirurgiaoPrincipal: "Dra. Ana Silva",
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
    cirurgiaoPrincipal: "Dra. Carla Rodrigues",
    membros: 3,
    procedimentosRealizados: 42,
    ehMembro: false,
    membrosList: ["Dra. Cintia Carvalho", "Dra. Carla Rodrigues", "Dr. John Lennon"],
  },
  {
    id: 8,
    especialidade: "Urologia",
    cirurgiaoPrincipal: "Dr. Roberto Alves",
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

// Dados fictícios expandidos para o mapa preliminar com diferentes datas
const generateMapaData = (date: Date): ProcedimentoMapa[] => {
  const dateKey = format(date, "yyyy-MM-dd")

  // Banco de dados fictício de procedimentos por data
  const procedimentosPorData: Record<string, ProcedimentoMapa[]> = {
    // Hoje - dia movimentado
    [format(new Date(), "yyyy-MM-dd")]: [
      {
        status: "EM ANDAMENTO",
        sala: 1,
        horario: "08:00",
        paciente: "José da Silva",
        idade: 54,
        procedimento: "COLECISTECTOMIA VIDEOLAPAROSCÓPICA",
        lateralidade: "N/A",
        cirurgiao: "DR. RICARDO SALLES",
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
      {
        status: "ALTA",
        sala: 4,
        horario: "11:30",
        paciente: "Ana Clara Souza",
        idade: 38,
        procedimento: "ARTROSCOPIA DE JOELHO",
        lateralidade: "DIREITO",
        cirurgiao: "DR. FERNANDO ALVES",
        convenio: "BRADESCO",
      },
    ],
    // Amanhã - dia moderado
    [format(addDays(new Date(), 1), "yyyy-MM-dd")]: [
      {
        status: "CHAMADO",
        sala: 1,
        horario: "07:30",
        paciente: "Carlos Eduardo Lima",
        idade: 67,
        procedimento: "PROSTATECTOMIA RADICAL",
        lateralidade: "N/A",
        cirurgiao: "DR. HENRIQUE SANTOS",
        convenio: "UNIMED",
      },
      {
        status: "RECEPÇÃO",
        sala: 2,
        horario: "09:00",
        paciente: "Lucia Fernandes",
        idade: 52,
        procedimento: "HISTERECTOMIA LAPAROSCÓPICA",
        lateralidade: "N/A",
        cirurgiao: "DRA. PATRICIA COSTA",
        convenio: "SULAMÉRICA",
      },
      {
        status: "EM ANDAMENTO",
        sala: 3,
        horario: "10:15",
        paciente: "Roberto Machado",
        idade: 41,
        procedimento: "SEPTOPLASTIA",
        lateralidade: "N/A",
        cirurgiao: "DR. LUCAS MENDES",
        convenio: "BRADESCO",
      },
    ],
    // Depois de amanhã - dia vazio (sem procedimentos)
    [format(addDays(new Date(), 2), "yyyy-MM-dd")]: [],
    // Daqui a 3 dias - dia com poucos procedimentos
    [format(addDays(new Date(), 3), "yyyy-MM-dd")]: [
      {
        status: "CHAMADO",
        sala: 1,
        horario: "08:00",
        paciente: "Fernanda Silva",
        idade: 29,
        procedimento: "CESARIANA",
        lateralidade: "N/A",
        cirurgiao: "DR. GUSTAVO VIDAL",
        convenio: "UNIMED",
      },
    ],
    // Daqui a 4 dias - dia muito movimentado
    [format(addDays(new Date(), 4), "yyyy-MM-dd")]: [
      {
        status: "EM ANDAMENTO",
        sala: 1,
        horario: "07:00",
        paciente: "João Carlos Pereira",
        idade: 58,
        procedimento: "BYPASS CORONÁRIO",
        lateralidade: "N/A",
        cirurgiao: "DR. ANTONIO CARDOSO",
        convenio: "GOLDEN",
      },
      {
        status: "CHAMADO",
        sala: 2,
        horario: "08:30",
        paciente: "Mariana Costa",
        idade: 34,
        procedimento: "MASTECTOMIA",
        lateralidade: "ESQUERDO",
        cirurgiao: "DRA. HELENA LIMA",
        convenio: "BRADESCO",
      },
      {
        status: "RECEPÇÃO",
        sala: 3,
        horario: "09:00",
        paciente: "Paulo Roberto Santos",
        idade: 46,
        procedimento: "NEFRECTOMIA PARCIAL",
        lateralidade: "DIREITO",
        cirurgiao: "DR. LEONARDO DIAS",
        convenio: "UNIMED",
      },
      {
        status: "ALTA",
        sala: 4,
        horario: "10:30",
        paciente: "Sandra Oliveira",
        idade: 39,
        procedimento: "TIREOIDECTOMIA",
        lateralidade: "N/A",
        cirurgiao: "DRA. CARLA RODRIGUES",
        convenio: "SULAMÉRICA",
      },
      {
        status: "CHAMADO",
        sala: 5,
        horario: "11:00",
        paciente: "Eduardo Rocha",
        idade: 55,
        procedimento: "ARTROPLASTIA DE QUADRIL",
        lateralidade: "ESQUERDO",
        cirurgiao: "DR. FERNANDO ALVES",
        convenio: "AMIL",
      },
      {
        status: "RECEPÇÃO",
        sala: 1,
        horario: "14:00",
        paciente: "Beatriz Antunes",
        idade: 25,
        procedimento: "RINOPLASTIA",
        lateralidade: "N/A",
        cirurgiao: "DR. LUCAS MENDES",
        convenio: "PARTICULAR",
      },
    ],
    // Daqui a 5 dias - dia com cancelamentos
    [format(addDays(new Date(), 5), "yyyy-MM-dd")]: [
      {
        status: "SUSPENSA",
        sala: 1,
        horario: "08:00",
        paciente: "Miguel Santos",
        idade: 43,
        procedimento: "HERNIORRAFIA UMBILICAL",
        lateralidade: "N/A",
        cirurgiao: "DR. JOSÉ AUGUSTO",
        convenio: "UNIMED",
      },
      {
        status: "CHAMADO",
        sala: 2,
        horario: "09:30",
        paciente: "Cristina Alves",
        idade: 37,
        procedimento: "LAQUEADURA TUBÁRIA",
        lateralidade: "N/A",
        cirurgiao: "DRA. PATRICIA COSTA",
        convenio: "BRADESCO",
      },
    ],
    // Ontem - dados históricos
    [format(subDays(new Date(), 1), "yyyy-MM-dd")]: [
      {
        status: "ALTA",
        sala: 1,
        horario: "07:30",
        paciente: "Ricardo Moreira",
        idade: 49,
        procedimento: "APENDICECTOMIA",
        lateralidade: "N/A",
        cirurgiao: "DR. CARLOS MENDES",
        convenio: "UNIMED",
      },
      {
        status: "ALTA",
        sala: 2,
        horario: "09:00",
        paciente: "Juliana Ferreira",
        idade: 31,
        procedimento: "COLECISTECTOMIA",
        lateralidade: "N/A",
        cirurgiao: "DR. RICARDO SALLES",
        convenio: "SULAMÉRICA",
      },
      {
        status: "ALTA",
        sala: 3,
        horario: "10:30",
        paciente: "Antonio Silva",
        idade: 64,
        procedimento: "CATARATA",
        lateralidade: "BILATERAL",
        cirurgiao: "DRA. ANA PAULA",
        convenio: "GOLDEN",
      },
    ],
    // Semana passada - mais dados históricos
    [format(subDays(new Date(), 7), "yyyy-MM-dd")]: [
      {
        status: "ALTA",
        sala: 1,
        horario: "08:00",
        paciente: "Vanessa Lima",
        idade: 28,
        procedimento: "CESARIANA",
        lateralidade: "N/A",
        cirurgiao: "DR. GUSTAVO VIDAL",
        convenio: "BRADESCO",
      },
      {
        status: "ALTA",
        sala: 2,
        horario: "10:00",
        paciente: "Marcos Souza",
        idade: 52,
        procedimento: "VASECTOMIA",
        lateralidade: "N/A",
        cirurgiao: "DR. ANDRÉ PEIXOTO",
        convenio: "UNIMED",
      },
    ],
  }

  // Se não há dados específicos para a data, gerar dados aleatórios
  if (!procedimentosPorData[dateKey]) {
    const random = Math.random()

    // 20% chance de dia vazio
    if (random < 0.2) {
      return []
    }

    // 30% chance de dia com poucos procedimentos (1-2)
    if (random < 0.5) {
      const nomes = ["Ana Silva", "João Santos", "Maria Oliveira"]
      const procedimentos = ["CONSULTA", "EXAME", "PEQUENA CIRURGIA"]
      const cirurgioes = ["DR. SILVA", "DRA. COSTA", "DR. MENDES"]
      const convenios = ["UNIMED", "BRADESCO", "SULAMÉRICA"]

      return Array.from({ length: Math.floor(Math.random() * 2) + 1 }, (_, i) => ({
        status: "CHAMADO" as Status,
        sala: i + 1,
        horario: `${8 + i}:00`,
        paciente: nomes[Math.floor(Math.random() * nomes.length)],
        idade: Math.floor(Math.random() * 50) + 20,
        procedimento: procedimentos[Math.floor(Math.random() * procedimentos.length)],
        lateralidade: "N/A" as Lateralidade,
        cirurgiao: cirurgioes[Math.floor(Math.random() * cirurgioes.length)],
        convenio: convenios[Math.floor(Math.random() * convenios.length)],
      }))
    }

    // 50% chance de dia normal (3-5 procedimentos)
    const nomes = [
      "Carlos Eduardo",
      "Fernanda Lima",
      "Roberto Santos",
      "Patricia Costa",
      "Lucas Mendes",
      "Helena Silva",
      "Antonio Rocha",
      "Mariana Alves",
      "Paulo Roberto",
      "Cristina Souza",
    ]
    const procedimentos = [
      "HERNIORRAFIA",
      "COLECISTECTOMIA",
      "APENDICECTOMIA",
      "ARTROSCOPIA",
      "FACOEMULSIFICAÇÃO",
      "RINOPLASTIA",
      "MASTECTOMIA",
      "PROSTATECTOMIA",
    ]
    const cirurgioes = [
      "DR. RICARDO SALLES",
      "DRA. ANA PAULA",
      "DR. CARLOS MENDES",
      "DRA. PATRICIA COSTA",
      "DR. LUCAS MENDES",
      "DR. FERNANDO ALVES",
    ]
    const convenios = ["UNIMED", "BRADESCO", "SULAMÉRICA", "GOLDEN", "AMIL"]
    const status: Status[] = ["CHAMADO", "RECEPÇÃO", "EM ANDAMENTO", "ALTA", "SRPA"]
    const lateralidades: Lateralidade[] = ["N/A", "DIREITO", "ESQUERDO", "BILATERAL"]

    const numProcedimentos = Math.floor(Math.random() * 3) + 3 // 3-5 procedimentos

    return Array.from({ length: numProcedimentos }, (_, i) => ({
      status: status[Math.floor(Math.random() * status.length)],
      sala: i + 1,
      horario: `${7 + Math.floor(i * 1.5)}:${Math.random() < 0.5 ? "00" : "30"}`,
      paciente: nomes[Math.floor(Math.random() * nomes.length)],
      idade: Math.floor(Math.random() * 60) + 20,
      procedimento: procedimentos[Math.floor(Math.random() * procedimentos.length)],
      lateralidade: lateralidades[Math.floor(Math.random() * lateralidades.length)],
      cirurgiao: cirurgioes[Math.floor(Math.random() * cirurgioes.length)],
      convenio: convenios[Math.floor(Math.random() * convenios.length)],
    }))
  }

  return procedimentosPorData[dateKey]
}

export default function AnalisarSolicitacoes() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState<SectionType>(null)
  const [processedSolicitations, setProcessedSolicitations] = useState<number[]>([])
  const [showMapaPreview, setShowMapaPreview] = useState(false)
  const [selectedAgendamento, setSelectedAgendamento] = useState<any>(null)
  const [currentMapDate, setCurrentMapDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Estados para os campos do pré-agendamento
  const [fieldStates, setFieldStates] = useState<
    Record<string, { confirmed: boolean; rejected: boolean; correctedValue?: string }>
  >({})

  const [filtroEspecialidade, setFiltroEspecialidade] = useState<string>("")
  const [filtroCirurgiao, setFiltroCirurgiao] = useState<string>("")
  const [equipesExibidas, setEquipesExibidas] = useState<Equipe[]>(equipes)
  const [equipeDetalhada, setEquipeDetalhada] = useState<Equipe | null>(null)

  // Dados simulados para agendamentos
  const agendamentos = [
    {
      data: "15/09",
      dataCompleta: "15/09/2025",
      procedimento: "COLECISTECTOMIA VIDEOLAPAROSCÓPICA",
      equipe: "DR. RICARDO SALLES",
      paciente: "JOSÉ DA SILVA",
      idade: 54,
      dataNascimento: "15/03/1971",
      sexo: "MASCULINO",
      convenio: "BRADESCO SAÚDE",
      lateralidade: "NÃO SE APLICA",
    },
    {
      data: "22/10",
      dataCompleta: "22/10/2025",
      procedimento: "HISTERECTOMIA VIDEOLAPAROSCÓPICA",
      equipe: "DRA. LÚCIA ANDRADE",
      paciente: "MARIA SANTOS",
      idade: 42,
      dataNascimento: "08/07/1982",
      sexo: "FEMININO",
      convenio: "UNIMED",
      lateralidade: "NÃO SE APLICA",
    },
    {
      data: "08/11",
      dataCompleta: "08/11/2025",
      procedimento: "HERNIORRAFIA INGUINAL BILATERAL",
      equipe: "DR. JOSÉ AUGUSTO",
      paciente: "CARLOS OLIVEIRA",
      idade: 38,
      dataNascimento: "22/12/1986",
      sexo: "MASCULINO",
      convenio: "SULAMÉRICA",
      lateralidade: "BILATERAL",
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

  // Função para navegar para o mapa do dia
  const irParaMapaDoDia = () => {
    router.push("/mapa-do-dia")
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

  // Função para confirmar campo
  const handleConfirmField = (fieldName: string) => {
    setFieldStates((prev) => ({
      ...prev,
      [fieldName]: { confirmed: true, rejected: false },
    }))
    toast({
      title: "Campo confirmado",
      description: `O campo ${fieldName} foi confirmado.`,
    })
  }

  // Função para rejeitar campo
  const handleRejectField = (fieldName: string) => {
    setFieldStates((prev) => ({
      ...prev,
      [fieldName]: { confirmed: false, rejected: true },
    }))
  }

  // Função para corrigir campo
  const handleCorrectField = (fieldName: string, value: string) => {
    setFieldStates((prev) => ({
      ...prev,
      [fieldName]: { confirmed: true, rejected: false, correctedValue: value },
    }))
    toast({
      title: "Campo corrigido",
      description: `O campo ${fieldName} foi corrigido.`,
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
    setFieldStates({}) // Reset field states
  }

  // Função para navegar datas no mapa preliminar
  const handlePreviousDay = () => {
    setCurrentMapDate((prev) => subDays(prev, 1))
  }

  const handleNextDay = () => {
    setCurrentMapDate((prev) => addDays(prev, 1))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentMapDate(date)
      setShowDatePicker(true)
    }
  }

  // Filtrar solicitações não processadas
  const solicitacoesAtivas = solicitacoesEquipe.filter((_, index) => !processedSolicitations.includes(index))

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
    setEquipesExibidas(equipes)
  }

  // Exibir detalhes da equipe
  const exibirDetalhes = (equipe: Equipe) => {
    setEquipeDetalhada(equipe)
  }

  // Solicitar cadastramento
  const solicitarCadastramento = () => {
    toast({
      title: "Solicitação Enviada!",
      description: "Sua solicitação foi enviada com sucesso. Em breve você receberá a confirmação.",
    })
  }

  // Renderizar campo com botões de confirmação/rejeição
  const renderFieldWithButtons = (fieldName: string, label: string, value: string, isDate = false) => {
    const fieldState = fieldStates[fieldName]

    if (fieldState?.confirmed && !fieldState.rejected) {
      return (
        <div className="space-y-2">
          <p className="font-bold">{label}:</p>
          <div className="flex items-center gap-2">
            <span className="font-normal bg-green-50 p-2 rounded border border-green-200">
              {fieldState.correctedValue || value}
            </span>
            <Check className="h-4 w-4 text-green-600" />
          </div>
        </div>
      )
    }

    if (fieldState?.rejected) {
      return (
        <div className="space-y-2">
          <p className="font-bold">{label}:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-normal bg-red-50 p-2 rounded border border-red-200">{value}</span>
              <X className="h-4 w-4 text-red-600" />
            </div>
            {isDate ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Selecionar nova data
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date()}
                    onSelect={(date) => {
                      if (date) {
                        handleCorrectField(fieldName, format(date, "dd/MM/yyyy", { locale: ptBR }))
                      }
                    }}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Digite a correção"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCorrectField(fieldName, (e.target as HTMLInputElement).value)
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement
                    if (input?.value) {
                      handleCorrectField(fieldName, input.value)
                    }
                  }}
                >
                  Corrigir
                </Button>
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <p className="font-bold">{label}:</p>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => handleRejectField(fieldName)} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleConfirmField(fieldName)} className="h-6 w-6 p-0">
              <Check className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <span className="font-normal">{value}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <GlobalHeader
        title="Análise de Solicitações"
        showMapButton={true}
        onMapClick={irParaMapaDoDia}
        mapButtonText="Mapa do Dia"
        mapButtonIcon={<Map className="h-4 w-4 mr-1" />}
      />

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
                      2
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
                      PACIENTE: {selectedAgendamento?.paciente || "JOSÉ DA SILVA"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {renderFieldWithButtons("nome", "NOME", selectedAgendamento?.paciente || "JOSÉ DA SILVA")}
                      {renderFieldWithButtons(
                        "idade",
                        "IDADE / DATA NASCIMENTO",
                        `${selectedAgendamento?.idade || 54} anos (${selectedAgendamento?.dataNascimento || "15/03/1971"})`,
                      )}
                      {renderFieldWithButtons("sexo", "SEXO", selectedAgendamento?.sexo || "MASCULINO")}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        {renderFieldWithButtons(
                          "data",
                          "DATA",
                          selectedAgendamento?.dataCompleta || "15/09/2025",
                          true,
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {renderFieldWithButtons(
                        "procedimento",
                        "PROCEDIMENTO",
                        selectedAgendamento?.procedimento || "COLECISTECTOMIA VIDEOLAPAROSCÓPICA - 31005497",
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderFieldWithButtons(
                        "lateralidade",
                        "LATERALIDADE",
                        selectedAgendamento?.lateralidade || "NÃO SE APLICA",
                      )}
                      {renderFieldWithButtons(
                        "convenio",
                        "CONVÊNIO",
                        selectedAgendamento?.convenio || "BRADESCO SAÚDE",
                      )}
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

        {/* Modal do Mapa Preliminar */}
        <Dialog open={showMapaPreview} onOpenChange={setShowMapaPreview}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                MAPA CIRÚRGICO PRELIMINAR - {format(currentMapDate, "dd/MM/yyyy", { locale: ptBR })}
              </DialogTitle>
            </DialogHeader>

            <div className="w-full">
              <Card className="shadow-md">
                <CardHeader className="bg-white border-b pb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle className="text-xl font-bold">
                      Visualização Preliminar - {format(currentMapDate, "dd/MM/yyyy", { locale: ptBR })}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={handlePreviousDay}>
                        Anterior
                      </Button>
                      <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[200px] justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(currentMapDate, "dd/MM/yyyy", { locale: ptBR })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar 
                            mode="single" 
                            selected={currentMapDate} 
                            onSelect={handleDateSelect} 
                            initialFocus 
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button variant="outline" onClick={handleNextDay}>
                        Próximo
                      </Button>
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
                    {generateMapaData(currentMapDate).length > 0 ? (
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
                          {generateMapaData(currentMapDate).map((proc, index) => (
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
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <CalendarIcon className="h-16 w-16 mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold mb-2">Nenhum procedimento agendado</h3>
                        <p className="text-sm">
                          Não há procedimentos agendados para {format(currentMapDate, "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </Dialog>
      </main>
    </div>
  )
}
