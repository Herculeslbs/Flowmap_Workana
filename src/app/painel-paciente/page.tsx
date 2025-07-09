"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Clock,
  User,
  FileText,
  Phone,
  History,
  Edit2,
  Check,
  X,
  AlertTriangle,
  BarChartIcon,
  TrendingUp,
  CalendarCheck,
  Ban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChartContainer, ChartLegend } from "@/components/ui/chart"
import { PieChart, Pie,BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from "recharts"

interface PacienteCompleto {
  id: string
  nome: string
  idade: number
  cpf: string
  rg: string
  endereco: string
  telefone: string
  email: string
  convenio: string
  numeroCartao: string
  procedimento: string
  cirurgiao: string
  anestesista: string
  instrumentadora: string
  sala: number
  status: string // Can be "CANCELADO"
  lateralidade: string
  alergias: string
  observacoes: string
  cancellationReason?: string // New field for cancelled surgeries
  contatoEmergencia: string
  telefoneEmergencia: string
  horarios: Array<{
    tipo: string
    horario: string
    usuario: string
    timestamp: string // ISO string for easier date calculations
  }>
  historico: Array<{
    data: string
    procedimento: string
    cirurgiao: string
    hospital: string
    observacoes: string
  }>
  contatosFamiliares: Array<{
    nome: string
    parentesco: string
    telefone: string
    receberNotificacoes: boolean
  }>
  timeline: Array<{
    tempo: string // "HH:mm"
    evento: string
    usuario: string
    timestamp: string // ISO string for precise calculations
  }>
  durationMinutes?: number // For average duration calculation
}

interface Horario {
  tipo: string
  horario: string
  usuario: string
  timestamp: string
}

interface HistoricoProcedimento {
  data: string
  procedimento: string
  cirurgiao: string
  hospital: string
  observacoes: string
}

interface ContatoFamiliar {
  nome: string
  parentesco: string
  telefone: string
  receberNotificacoes: boolean
}

export default function PainelPaciente() {
  const router = useRouter()
  const { toast } = useToast()

  // Dados fictícios de múltiplos pacientes para as estatísticas
  const pacientesData: PacienteCompleto[] = [
    {
      id: "1",
      nome: "João Batista Moreira",
      idade: 45,
      cpf: "123.456.789-00",
      rg: "12.345.678-9",
      endereco: "Rua das Flores, 123 - Centro - São Paulo/SP",
      telefone: "(11) 99999-9999",
      email: "joao.moreira@email.com",
      convenio: "UNIMED",
      numeroCartao: "123456789012345",
      procedimento: "Herniorrafia Inguinal",
      cirurgiao: "Dr. Ricardo Salles",
      anestesista: "Dr. Carlos Silva",
      instrumentadora: "Enf. Maria Santos",
      sala: 1,
      status: "SRPA",
      lateralidade: "DIREITO",
      alergias: "Dipirona, Penicilina",
      observacoes: "Paciente hipertenso, em uso de Losartana 50mg",
      contatoEmergencia: "Maria Moreira (Esposa)",
      telefoneEmergencia: "(11) 98888-8888",
      horarios: [
        { tipo: "ENTRADA EM SALA", horario: "07:15", usuario: "Enf. Ana Silva", timestamp: "2025-01-04T10:15:00Z" },
        {
          tipo: "INÍCIO DA ANESTESIA",
          horario: "07:30",
          usuario: "Dr. Carlos Silva",
          timestamp: "2025-01-04T10:30:00Z",
        },
        {
          tipo: "INÍCIO DA CIRURGIA",
          horario: "07:45",
          usuario: "Dr. Ricardo Salles",
          timestamp: "2025-01-04T10:45:00Z",
        },
      ],
      historico: [
        {
          data: "15/03/2023",
          procedimento: "Apendicectomia",
          cirurgiao: "Dr. João Santos",
          hospital: "Hospital São Lucas",
          observacoes: "Procedimento sem intercorrências",
        },
      ],
      contatosFamiliares: [
        { nome: "Maria Moreira", parentesco: "Esposa", telefone: "(11) 98888-8888", receberNotificacoes: true },
      ],
      timeline: [
        {
          tempo: "06:30",
          evento: "Paciente admitido na unidade",
          usuario: "Recepção",
          timestamp: "2025-01-04T09:30:00Z",
        },
        {
          tempo: "07:00",
          evento: "Preparação pré-operatória iniciada",
          usuario: "Enf. Ana Silva",
          timestamp: "2025-01-04T10:00:00Z",
        },
        {
          tempo: "07:15",
          evento: "Entrada em sala cirúrgica",
          usuario: "Enf. Ana Silva",
          timestamp: "2025-01-04T10:15:00Z",
        },
        {
          tempo: "07:30",
          evento: "Início da anestesia",
          usuario: "Dr. Carlos Silva",
          timestamp: "2025-01-04T10:30:00Z",
        },
        {
          tempo: "07:45",
          evento: "Início da cirurgia",
          usuario: "Dr. Ricardo Salles",
          timestamp: "2025-01-04T10:45:00Z",
        },
        { tempo: "08:30", evento: "Fim da cirurgia", usuario: "Dr. Ricardo Salles", timestamp: "2025-01-04T11:30:00Z" },
        { tempo: "08:45", evento: "Fim da anestesia", usuario: "Dr. Carlos Silva", timestamp: "2025-01-04T11:45:00Z" },
        {
          tempo: "09:00",
          evento: "Transferido para SRPA",
          usuario: "Enf. Ana Silva",
          timestamp: "2025-01-04T12:00:00Z",
        },
        {
          tempo: "10:00",
          evento: "Saída da SRPA para Quarto",
          usuario: "Enf. Ana Silva",
          timestamp: "2025-01-04T13:00:00Z",
        },
        {
          tempo: "15:00",
          evento: "Paciente recebeu alta",
          usuario: "Dr. João Silva",
          timestamp: "2025-01-04T18:00:00Z",
        },
      ],
      durationMinutes: 45, // Fictitious duration for this surgery
    },
    {
      id: "2",
      nome: "Ana Paula Costa",
      idade: 30,
      cpf: "987.654.321-00",
      rg: "98.765.432-1",
      endereco: "Av. Principal, 456 - Centro - Rio de Janeiro/RJ",
      telefone: "(21) 98888-7777",
      email: "ana.costa@email.com",
      convenio: "SULAMÉRICA",
      numeroCartao: "543210987654321",
      procedimento: "Colecistectomia",
      cirurgiao: "Dr. Fernanda Lima",
      anestesista: "Dr. Pedro Rocha",
      instrumentadora: "Enf. Carla Dias",
      sala: 2,
      status: "ALTA",
      lateralidade: "N/A",
      alergias: "Nenhuma",
      observacoes: "Paciente sem comorbidades",
      contatoEmergencia: "Carlos Costa (Pai)",
      telefoneEmergencia: "(21) 97777-6666",
      horarios: [
        { tipo: "ENTRADA EM SALA", horario: "08:00", usuario: "Enf. Julia", timestamp: "2025-01-05T11:00:00Z" },
        {
          tipo: "INÍCIO DA ANESTESIA",
          horario: "08:15",
          usuario: "Dr. Pedro Rocha",
          timestamp: "2025-01-05T11:15:00Z",
        },
        {
          tipo: "INÍCIO DA CIRURGIA",
          horario: "08:30",
          usuario: "Dr. Fernanda Lima",
          timestamp: "2025-01-05T11:30:00Z",
        },
        { tipo: "FIM DA CIRURGIA", horario: "09:45", usuario: "Dr. Fernanda Lima", timestamp: "2025-01-05T12:45:00Z" },
        { tipo: "FIM DA ANESTESIA", horario: "10:00", usuario: "Dr. Pedro Rocha", timestamp: "2025-01-05T13:00:00Z" },
        { tipo: "SAÍDA DE SALA", horario: "10:15", usuario: "Enf. Julia", timestamp: "2025-01-05T13:15:00Z" },
      ],
      historico: [],
      contatosFamiliares: [
        { nome: "Carlos Costa", parentesco: "Pai", telefone: "(21) 97777-6666", receberNotificacoes: true },
      ],
      timeline: [
        {
          tempo: "07:30",
          evento: "Paciente admitido na unidade",
          usuario: "Recepção",
          timestamp: "2025-01-05T10:30:00Z",
        },
        {
          tempo: "08:00",
          evento: "Entrada em sala cirúrgica",
          usuario: "Enf. Julia",
          timestamp: "2025-01-05T11:00:00Z",
        },
        {
          tempo: "08:15",
          evento: "Início da anestesia",
          usuario: "Dr. Pedro Rocha",
          timestamp: "2025-01-05T11:15:00Z",
        },
        {
          tempo: "08:30",
          evento: "Início da cirurgia",
          usuario: "Dr. Fernanda Lima",
          timestamp: "2025-01-05T11:30:00Z",
        },
        { tempo: "09:45", evento: "Fim da cirurgia", usuario: "Dr. Fernanda Lima", timestamp: "2025-01-05T12:45:00Z" },
        { tempo: "10:00", evento: "Fim da anestesia", usuario: "Dr. Pedro Rocha", timestamp: "2025-01-05T13:00:00Z" },
        { tempo: "10:15", evento: "Transferido para SRPA", usuario: "Enf. Julia", timestamp: "2025-01-05T13:15:00Z" },
        {
          tempo: "11:30",
          evento: "Saída da SRPA para Quarto",
          usuario: "Enf. Julia",
          timestamp: "2025-01-05T14:30:00Z",
        },
        {
          tempo: "16:00",
          evento: "Paciente recebeu alta",
          usuario: "Dr. Fernanda Lima",
          timestamp: "2025-01-05T19:00:00Z",
        },
      ],
      durationMinutes: 75,
    },
    {
      id: "3",
      nome: "Pedro Henrique Santos",
      idade: 60,
      cpf: "111.222.333-44",
      rg: "11.222.333-4",
      endereco: "Rua da Paz, 789 - Copacabana - Rio de Janeiro/RJ",
      telefone: "(21) 99999-1111",
      email: "pedro.santos@email.com",
      convenio: "BRADESCO SAÚDE",
      numeroCartao: "987654321098765",
      procedimento: "Catarata",
      cirurgiao: "Dr. Lucas Mendes",
      anestesista: "Dr. Sofia Castro",
      instrumentadora: "Enf. Roberto Alves",
      sala: 3,
      status: "CANCELADO",
      lateralidade: "ESQUERDO",
      alergias: "Iodo",
      observacoes: "Paciente diabético, em uso de insulina",
      cancellationReason: "Paciente não compareceu",
      contatoEmergencia: "Mariana Santos (Filha)",
      telefoneEmergencia: "(21) 98888-2222",
      horarios: [],
      historico: [],
      contatosFamiliares: [
        { nome: "Mariana Santos", parentesco: "Filha", telefone: "(21) 98888-2222", receberNotificacoes: true },
      ],
      timeline: [
        {
          tempo: "07:00",
          evento: "Paciente admitido na unidade",
          usuario: "Recepção",
          timestamp: "2025-01-06T10:00:00Z",
        },
        { tempo: "07:30", evento: "Cirurgia cancelada", usuario: "Secretaria", timestamp: "2025-01-06T10:30:00Z" },
      ],
      durationMinutes: 0,
    },
    {
      id: "4",
      nome: "Mariana Oliveira",
      idade: 28,
      cpf: "444.555.666-77",
      rg: "44.555.666-7",
      endereco: "Rua das Palmeiras, 10 - Barra da Tijuca - Rio de Janeiro/RJ",
      telefone: "(21) 97777-3333",
      email: "mariana.o@email.com",
      convenio: "AMIL",
      numeroCartao: "112233445566778",
      procedimento: "Rinoplastia",
      cirurgiao: "Dr. Helena Costa",
      anestesista: "Dr. Gustavo Pereira",
      instrumentadora: "Enf. Lúcia Mendes",
      sala: 4,
      status: "EM ANDAMENTO",
      lateralidade: "N/A",
      alergias: "Nenhuma",
      observacoes: "Primeira cirurgia estética",
      contatoEmergencia: "Roberto Oliveira (Irmão)",
      telefoneEmergencia: "(21) 96666-4444",
      horarios: [
        { tipo: "ENTRADA EM SALA", horario: "09:00", usuario: "Enf. Lúcia", timestamp: "2025-01-07T12:00:00Z" },
        { tipo: "INÍCIO DA ANESTESIA", horario: "09:15", usuario: "Dr. Gustavo", timestamp: "2025-01-07T12:15:00Z" },
        { tipo: "INÍCIO DA CIRURGIA", horario: "09:45", usuario: "Dr. Helena", timestamp: "2025-01-07T12:45:00Z" },
      ],
      historico: [],
      contatosFamiliares: [
        { nome: "Roberto Oliveira", parentesco: "Irmão", telefone: "(21) 96666-4444", receberNotificacoes: true },
      ],
      timeline: [
        {
          tempo: "08:30",
          evento: "Paciente admitido na unidade",
          usuario: "Recepção",
          timestamp: "2025-01-07T11:30:00Z",
        },
        {
          tempo: "09:00",
          evento: "Entrada em sala cirúrgica",
          usuario: "Enf. Lúcia",
          timestamp: "2025-01-07T12:00:00Z",
        },
        { tempo: "09:15", evento: "Início da anestesia", usuario: "Dr. Gustavo", timestamp: "2025-01-07T12:15:00Z" },
        { tempo: "09:45", evento: "Início da cirurgia", usuario: "Dr. Helena", timestamp: "2025-01-07T12:45:00Z" },
      ],
      durationMinutes: undefined, // Still in progress
    },
    {
      id: "5",
      nome: "Carlos Eduardo Lima",
      idade: 55,
      cpf: "777.888.999-00",
      rg: "77.888.999-0",
      endereco: "Rua dos Coqueiros, 500 - Centro - Belo Horizonte/MG",
      telefone: "(31) 99999-5555",
      email: "carlos.lima@email.com",
      convenio: "UNIMED",
      numeroCartao: "998877665544332",
      procedimento: "Artroplastia de Quadril",
      cirurgiao: "Dr. Paulo Roberto",
      anestesista: "Dr. Juliana Almeida",
      instrumentadora: "Enf. Fernando Costa",
      sala: 1,
      status: "ALTA",
      lateralidade: "DIREITO",
      alergias: "Nenhuma",
      observacoes: "Paciente com histórico de osteoporose",
      contatoEmergencia: "Beatriz Lima (Esposa)",
      telefoneEmergencia: "(31) 98888-4444",
      horarios: [
        { tipo: "ENTRADA EM SALA", horario: "10:00", usuario: "Enf. Fernando", timestamp: "2025-01-08T13:00:00Z" },
        { tipo: "INÍCIO DA ANESTESIA", horario: "10:15", usuario: "Dr. Juliana", timestamp: "2025-01-08T13:15:00Z" },
        { tipo: "INÍCIO DA CIRURGIA", horario: "10:45", usuario: "Dr. Paulo", timestamp: "2025-01-08T13:45:00Z" },
        { tipo: "FIM DA CIRURGIA", horario: "12:30", usuario: "Dr. Paulo", timestamp: "2025-01-08T15:30:00Z" },
        { tipo: "FIM DA ANESTESIA", horario: "12:45", usuario: "Dr. Juliana", timestamp: "2025-01-08T15:45:00Z" },
        { tipo: "SAÍDA DE SALA", horario: "13:00", usuario: "Enf. Fernando", timestamp: "2025-01-08T16:00:00Z" },
      ],
      historico: [],
      contatosFamiliares: [
        { nome: "Beatriz Lima", parentesco: "Esposa", telefone: "(31) 98888-4444", receberNotificacoes: true },
      ],
      timeline: [
        {
          tempo: "09:30",
          evento: "Paciente admitido na unidade",
          usuario: "Recepção",
          timestamp: "2025-01-08T12:30:00Z",
        },
        {
          tempo: "10:00",
          evento: "Entrada em sala cirúrgica",
          usuario: "Enf. Fernando",
          timestamp: "2025-01-08T13:00:00Z",
        },
        { tempo: "10:15", evento: "Início da anestesia", usuario: "Dr. Juliana", timestamp: "2025-01-08T13:15:00Z" },
        { tempo: "10:45", evento: "Início da cirurgia", usuario: "Dr. Paulo", timestamp: "2025-01-08T13:45:00Z" },
        { tempo: "12:30", evento: "Fim da cirurgia", usuario: "Dr. Paulo", timestamp: "2025-01-08T15:30:00Z" },
        { tempo: "12:45", evento: "Fim da anestesia", usuario: "Dr. Juliana", timestamp: "2025-01-08T15:45:00Z" },
        {
          tempo: "13:00",
          evento: "Transferido para SRPA",
          usuario: "Enf. Fernando",
          timestamp: "2025-01-08T16:00:00Z",
        },
        {
          tempo: "14:30",
          evento: "Saída da SRPA para Quarto",
          usuario: "Enf. Fernando",
          timestamp: "2025-01-08T17:30:00Z",
        },
        { tempo: "18:00", evento: "Paciente recebeu alta", usuario: "Dr. Paulo", timestamp: "2025-01-08T21:00:00Z" },
      ],
      durationMinutes: 105,
    },
  ]

  // O paciente principal exibido nas abas de detalhes (Dados Gerais, Horários, etc.)
  const [paciente, setPaciente] = useState<PacienteCompleto>(pacientesData[0])

  // Horários importantes para o paciente atual
  const [horarios, setHorarios] = useState<Horario[]>(paciente.horarios)

  // Estados para edição
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState("")
  const [editedFields, setEditedFields] = useState<Record<string, { usuario: string; timestamp: string }>>({})

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field)
    setTempValue(currentValue)
  }

  const handleSave = (field: string) => {
    setConfirmMessage(`Confirmar alteração do campo ${field}?`)
    setConfirmAction(() => () => {
      setPaciente((prev) => ({ ...prev, [field]: tempValue }))
      setEditedFields((prev) => ({
        ...prev,
        [field]: { usuario: "Dr. João Silva", timestamp: new Date().toLocaleString("pt-BR") },
      }))
      setEditingField(null)
      setShowConfirmDialog(false)
      toast({
        title: "Campo atualizado",
        description: `${field} foi alterado com sucesso.`,
      })
    })
    setShowConfirmDialog(true)
  }

  const handleAddHorario = (tipo: string) => {
    const agora = new Date()
    const horarioAtual = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

    setConfirmMessage(`Confirmar registro de ${tipo} às ${horarioAtual}?`)
    setConfirmAction(() => () => {
      const novoHorario: Horario = {
        tipo,
        horario: horarioAtual,
        usuario: "Dr. João Silva", // Fictício
        timestamp: agora.toISOString(),
      }
      setHorarios((prev) => [...prev, novoHorario])
      setShowConfirmDialog(false)
      toast({
        title: "Horário registrado",
        description: `${tipo} registrado às ${horarioAtual}`,
      })
    })
    setShowConfirmDialog(true)
  }

  const tiposHorario = [
    "ENTRADA EM SALA",
    "INÍCIO DA ANESTESIA",
    "INÍCIO DA CIRURGIA",
    "FIM DA CIRURGIA",
    "FIM DA ANESTESIA",
    "SAÍDA DE SALA",
  ]

  const horariosRegistrados = horarios.map((h) => h.tipo)
  const horariosDisponiveis = tiposHorario.filter((tipo) => !horariosRegistrados.includes(tipo))

  // --- Estatísticas ---

  // Relatórios Estatísticos
  const totalSurgeries = pacientesData.length
  const completedSurgeries = pacientesData.filter((p) => p.status === "ALTA").length
  const inProgressSurgeries = pacientesData.filter((p) => p.status === "EM ANDAMENTO").length
  const cancelledSurgeries = pacientesData.filter((p) => p.status === "CANCELADO").length

  const completedProceduresWithDuration = pacientesData.filter(
    (p) => p.status === "ALTA" && p.durationMinutes !== undefined && p.durationMinutes > 0,
  )
  const averageProcedureDuration =
    completedProceduresWithDuration.reduce((sum, p) => sum + (p.durationMinutes || 0), 0) /
      completedProceduresWithDuration.length || 0

  const surgeriesByProcedure = pacientesData.reduce(
    (acc, p) => {
      acc[p.procedimento] = (acc[p.procedimento] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const surgeriesBySurgeon = pacientesData.reduce(
    (acc, p) => {
      acc[p.cirurgiao] = (acc[p.cirurgiao] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const surgeriesByStatus = [
    { name: "Concluídas", value: completedSurgeries, color: "#22C55E" },
    { name: "Em Andamento", value: inProgressSurgeries, color: "#F59E0B" },
    { name: "Canceladas", value: cancelledSurgeries, color: "#EF4444" },
  ]

  const cancelledSurgeriesList = pacientesData.filter((p) => p.status === "CANCELADO")

  // Estatísticas de Tempo
  const calculateDuration = (startEvent: string, endEvent: string, timeline: any[]) => {
    const startTime = timeline.find((item) => item.evento === startEvent)?.timestamp
    const endTime = timeline.find((item) => item.evento === endEvent)?.timestamp

    if (startTime && endTime) {
      const start = new Date(startTime)
      const end = new Date(endTime)
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60)) // Duration in minutes
    }
    return null
  }

  const calculateAverageDuration = (eventPairs: [string, string][]) => {
    let totalDuration = 0
    let count = 0

    pacientesData.forEach((p) => {
      eventPairs.forEach(([startEvent, endEvent]) => {
        const duration = calculateDuration(startEvent, endEvent, p.timeline)
        if (duration !== null) {
          totalDuration += duration
          count++
        }
      })
    })
    return count > 0 ? Math.round(totalDuration / count) : 0
  }

  const avgAdmissionToSurgeryStart = calculateAverageDuration([["Paciente admitido na unidade", "Início da cirurgia"]])
  const avgSurgeryEndToDischarge = calculateAverageDuration([["Fim da cirurgia", "Paciente recebeu alta"]])
  const avgSRPAStay = calculateAverageDuration([["Transferido para SRPA", "Saída da SRPA para Quarto"]])
  const avgQuartoStay = calculateAverageDuration([["Saída da SRPA para Quarto", "Paciente recebeu alta"]])
  const avgAPOStay = calculateAverageDuration([["Transferido para APO", "Saída da APO para Quarto"]])

  const timeStatsData = [
    { name: "Admissão até Cirurgia", value: avgAdmissionToSurgeryStart, unit: "min" },
    { name: "Fim Cirurgia até Alta", value: avgSurgeryEndToDischarge, unit: "min" },
    { name: "Permanência SRPA", value: avgSRPAStay, unit: "min" },
    { name: "Permanência Quarto", value: avgQuartoStay, unit: "min" },
    { name: "Permanência APO", value: avgAPOStay, unit: "min" },
  ].filter((item) => item.value !== null) // Filter out null values if events are missing

  const CHART_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F", "#FFBB28", "#0088FE", "#AF19FF"]

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Mapa
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{paciente.nome}</h1>
              <p className="text-gray-600">
                {paciente.procedimento} - Sala {paciente.sala}
              </p>
            </div>
            <Badge className="text-lg px-4 py-2 bg-orange-200 text-black border border-orange-500">
              {paciente.status}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="horarios">Horários</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="familiares">Familiares</TabsTrigger>
            <TabsTrigger value="estatisticas">Relatórios Estatísticos</TabsTrigger>
            <TabsTrigger value="tempo">Estatísticas de Tempo</TabsTrigger>
          </TabsList>

          {/* Aba Dados Gerais */}
          <TabsContent value="geral">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dados Pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries({
                    nome: "Nome Completo",
                    idade: "Idade",
                    cpf: "CPF",
                    rg: "RG",
                    endereco: "Endereço",
                    telefone: "Telefone",
                    email: "E-mail",
                  }).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <div className="flex items-center gap-2">
                        {editingField === key ? (
                          <div className="flex gap-2 flex-1">
                            <Input
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="flex-1"
                            />
                            <Button size="sm" onClick={() => handleSave(key)}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="flex-1"></span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(key, String(paciente[key as keyof PacienteCompleto]))}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {editedFields[key] && (
                              <span
                                className="text-xs text-blue-600 cursor-help"
                                title={`Editado por ${editedFields[key].usuario} em ${editedFields[key].timestamp}`}
                              >
                                editado
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Dados do Procedimento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Dados do Procedimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries({
                    procedimento: "Procedimento",
                    cirurgiao: "Cirurgião",
                    anestesista: "Anestesista",
                    instrumentadora: "Instrumentadora",
                    sala: "Sala",
                    lateralidade: "Lateralidade",
                    convenio: "Convênio",
                    numeroCartao: "Número do Cartão",
                  }).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <div className="flex items-center gap-2">
                        {editingField === key ? (
                          <div className="flex gap-2 flex-1">
                            <Input
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="flex-1"
                            />
                            <Button size="sm" onClick={() => handleSave(key)}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="flex-1"></span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(key, String(paciente[key as keyof PacienteCompleto]))}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {editedFields[key] && (
                              <span
                                className="text-xs text-blue-600 cursor-help"
                                title={`Editado por ${editedFields[key].usuario} em ${editedFields[key].timestamp}`}
                              >
                                editado
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Informações Médicas */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Informações Médicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Alergias</Label>
                      <div className="flex items-center gap-2">
                        {editingField === "alergias" ? (
                          <div className="flex gap-2 flex-1">
                            <Textarea
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="flex-1"
                            />
                            <div className="flex flex-col gap-2">
                              <Button size="sm" onClick={() => handleSave("alergias")}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 flex-1">
                            <span className="flex-1 bg-red-50 p-2 rounded border border-red-200">
                              {paciente.alergias}
                            </span>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit("alergias", paciente.alergias)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {editedFields.alergias && (
                              <span
                                className="text-xs text-blue-600 cursor-help"
                                title={`Editado por ${editedFields.alergias.usuario} em ${editedFields.alergias.timestamp}`}
                              >
                                editado
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <div className="flex items-center gap-2">
                        {editingField === "observacoes" ? (
                          <div className="flex gap-2 flex-1">
                            <Textarea
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              className="flex-1"
                            />
                            <div className="flex flex-col gap-2">
                              <Button size="sm" onClick={() => handleSave("observacoes")}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 flex-1">
                            <span className="flex-1 bg-yellow-50 p-2 rounded border border-yellow-200">
                              {paciente.observacoes}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit("observacoes", paciente.observacoes)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {editedFields.observacoes && (
                              <span
                                className="text-xs text-blue-600 cursor-help"
                                title={`Editado por ${editedFields.observacoes.usuario} em ${editedFields.observacoes.timestamp}`}
                              >
                                editado
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Horários */}
          <TabsContent value="horarios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horários do Procedimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Horários Registrados */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Horários Registrados</h3>
                    <div className="space-y-3">
                      {horarios.length > 0 ? (
                        horarios.map((horario, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div>
                              <span className="font-semibold text-green-800">{horario.tipo}</span>
                              <p className="text-sm text-gray-600">
                                Registrado por {horario.usuario} em{" "}
                                {new Date(horario.timestamp).toLocaleString("pt-BR")}
                              </p>
                            </div>
                            <span className="text-2xl font-bold text-green-700">{horario.horario}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Nenhum horário registrado para este paciente.</p>
                      )}
                    </div>
                  </div>

                  {/* Horários Pendentes */}
                  {horariosDisponiveis.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Registrar Horários</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {horariosDisponiveis.map((tipo) => (
                          <Button
                            key={tipo}
                            variant="outline"
                            className="p-4 h-auto flex flex-col items-center gap-2 hover:bg-blue-50 bg-transparent"
                            onClick={() => handleAddHorario(tipo)}
                          >
                            <Clock className="h-5 w-5" />
                            <span className="text-sm font-medium text-center">{tipo}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Timeline */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Timeline do Procedimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paciente.timeline.length > 0 ? (
                    paciente.timeline.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex-shrink-0 w-16 text-sm font-semibold text-blue-600">{item.tempo}</div>
                        <div className="flex-1">
                          <p className="font-medium">{item.evento}</p>
                          <p className="text-sm text-gray-600">Por: {item.usuario}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum evento na timeline para este paciente.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Histórico */}
          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Procedimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paciente.historico.length > 0 ? (
                    paciente.historico.map((proc, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{proc.procedimento}</h3>
                          <span className="text-sm text-gray-600">{proc.data}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Cirurgião:</strong> {proc.cirurgiao}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Hospital:</strong> {proc.hospital}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Observações:</strong> {proc.observacoes}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum histórico de procedimentos para este paciente.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Familiares */}
          <TabsContent value="familiares">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contatos para Notificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paciente.contatosFamiliares.length > 0 ? (
                    paciente.contatosFamiliares.map((contato, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold">{contato.nome}</h3>
                          <p className="text-sm text-gray-600">{contato.parentesco}</p>
                          <p className="text-sm text-gray-600">{contato.telefone}</p>
                        </div>
                        <Badge variant={contato.receberNotificacoes ? "default" : "secondary"}>
                          {contato.receberNotificacoes ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum contato familiar registrado para este paciente.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Relatórios Estatísticos */}
          <TabsContent value="estatisticas">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5" />
                  Relatórios Estatísticos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Resumo das Cirurgias */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total de Cirurgias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalSurgeries}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Cirurgias Concluídas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{completedSurgeries}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Cirurgias em Andamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{inProgressSurgeries}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Cirurgias Canceladas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{cancelledSurgeries}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Média de Duração dos Procedimentos Concluídos */}
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Média de Duração dos Procedimentos Concluídos:</h3>
                  <span className="text-xl font-bold text-blue-800">{averageProcedureDuration.toFixed(0)} minutos</span>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cirurgias por Status */}
                  <Card>
  <CardHeader>
    <CardTitle>Cirurgias por Status</CardTitle>
  </CardHeader>
  <CardContent className="flex items-center justify-center">
    <ChartContainer config={{}} className="min-h-[200px] w-full">
      <PieChart>
        <Pie
          data={surgeriesByStatus}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={80}
          label
        >
          {surgeriesByStatus.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <ChartLegend />
    </ChartContainer>
  </CardContent>
</Card>
                  {/* Cirurgias por Tipo de Procedimento */}
                  <Card>
  <CardHeader>
    <CardTitle>Cirurgias por Tipo de Procedimento</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={{}} className="min-h-[200px] w-full">
      <BarChart data={Object.entries(surgeriesByProcedure).map(([name, value]) => ({ name, value }))}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#4C51BF" radius={[4, 4, 0, 0]} />
      </BarChart>
      <ChartLegend />
    </ChartContainer>
  </CardContent>
</Card>

                  {/* Cirurgias por Cirurgião */}
                  <Card className="lg:col-span-2">
  <CardHeader>
    <CardTitle>Cirurgias por Cirurgião</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={{}} className="min-h-[200px] w-full">
      <BarChart data={Object.entries(surgeriesBySurgeon).map(([name, value]) => ({ name, value }))}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
      <ChartLegend />
    </ChartContainer>
  </CardContent>
</Card>
                </div>

                {/* Cirurgias Canceladas e Motivos */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Ban className="h-5 w-5 text-red-600" />
                    Cirurgias Canceladas e Motivos
                  </h3>
                  {cancelledSurgeriesList.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-gray-50 text-left text-sm font-medium text-gray-700">
                            <th className="px-4 py-2">Paciente</th>
                            <th className="px-4 py-2">Procedimento</th>
                            <th className="px-4 py-2">Motivo do Cancelamento</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cancelledSurgeriesList.map((s, index) => (
                            <tr key={index} className="border-t border-gray-200 hover:bg-gray-100">
                              <td className="px-4 py-2">{s.nome}</td>
                              <td className="px-4 py-2">{s.procedimento}</td>
                              <td className="px-4 py-2">{s.cancellationReason || "Não especificado"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhuma cirurgia cancelada registrada.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Estatísticas de Tempo */}
          <TabsContent value="tempo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estatísticas de Tempo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Resumo das Médias de Tempo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {timeStatsData.map((stat, index) => (
                    <Card key={index} className="bg-purple-50 border-purple-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {stat.value} {stat.unit}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Gráfico de Médias de Tempo */}
                <Card>
  <CardHeader>
    <CardTitle>Médias de Tempo por Etapa (minutos)</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={{}} className="min-h-[250px] w-full">
      <BarChart data={timeStatsData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#7C3AED" radius={[4, 4, 0, 0]} />
      </BarChart>
      <ChartLegend />
    </ChartContainer>
  </CardContent>
</Card>

                {/* Tabela Detalhada de Tempos de Transição (Exemplo) */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-indigo-600" />
                    Tempos de Transição (Exemplo Fictício)
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50 text-left text-sm font-medium text-gray-700">
                          <th className="px-4 py-2">Paciente</th>
                          <th className="px-4 py-2">Admissão &gt; Cirurgia (min)</th>
                          <th className="px-4 py-2">Fim Cirurgia &gt; Alta (min)</th>
                          <th className="px-4 py-2">Permanência SRPA (min)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pacientesData.slice(0, 5).map(
                          (
                            p,
                            index, // Showing first 5 for brevity
                          ) => (
                            <tr key={index} className="border-t border-gray-200 hover:bg-gray-100">
                              <td className="px-4 py-2">{p.nome}</td>
                              <td className="px-4 py-2">
                                {calculateDuration("Paciente admitido na unidade", "Início da cirurgia", p.timeline) ||
                                  "N/A"}
                              </td>
                              <td className="px-4 py-2">
                                {calculateDuration("Fim da cirurgia", "Paciente recebeu alta", p.timeline) || "N/A"}
                              </td>
                              <td className="px-4 py-2">
                                {calculateDuration("Transferido para SRPA", "Saída da SRPA para Quarto", p.timeline) ||
                                  "N/A"}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de Confirmação */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Alteração</DialogTitle>
            <DialogDescription>{confirmMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              NÃO
            </Button>
            <Button onClick={confirmAction}>SIM</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
