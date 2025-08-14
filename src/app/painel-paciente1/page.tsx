"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { User, Clock, FileText, Phone, Edit2, Check, X, Plus, Share2, Heart, History, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PacienteCompleto {
  id: string
  nome: string
  idade: number
  dataNascimento: string
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
  status: string
  lateralidade: string
  alergias: string
  descricaoAlergias: string
  observacoes: string
  contatoEmergencia: string
  telefoneEmergencia: string
  avaliacaoPreAnestesica: string
  horarios: Array<{
    tipo: string
    horario: string
    usuario: string
    timestamp: string
  }>
  historico: Array<{
    id: string
    data: string
    procedimento: string
    cirurgiao: string
    hospital: string
    observacoes: string
    resumo: string
    timeline: Array<{
      tempo: string
      evento: string
      usuario: string
    }>
  }>
  acompanhantes: Array<{
    nome: string
    parentesco: string
    telefone: string
    receberNotificacoes: boolean
  }>
  timeline: Array<{
    tempo: string
    evento: string
    usuario: string
    timestamp: string
    duracao?: number
  }>
  registro: string
  dataCirurgia: string
  horario: string
}

interface Horario {
  tipo: string
  horario: string
  usuario: string
  timestamp: string
}

const pacientesData: Record<string, PacienteCompleto> = {
  "1": {
    id: "1",
    nome: "João Batista Moreira",
    idade: 45,
    dataNascimento: "15/03/1979",
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
    descricaoAlergias: "Reação alérgica grave à dipirona com edema de glote. Penicilina causa urticária generalizada.",
    observacoes: "Paciente hipertenso, em uso de Losartana 50mg",
    contatoEmergencia: "Maria Moreira (Esposa)",
    telefoneEmergencia: "(11) 98888-8888",
    avaliacaoPreAnestesica: "",
    horarios: [
      { tipo: "ENTRADA EM SALA", horario: "07:15", usuario: "Tec. Pedro Pedroso", timestamp: "2025-01-04T10:15:00Z" },
      {
        tipo: "INÍCIO DA ANESTESIA",
        horario: "07:30",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T10:30:00Z",
      },
      {
        tipo: "INÍCIO DA CIRURGIA",
        horario: "07:45",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T10:45:00Z",
      },
      
    ],
    historico: [
      {
        id: "hist1",
        data: "15/03/2023",
        procedimento: "Apendicectomia",
        cirurgiao: "Dr. João Santos",
        hospital: "Hospital São Lucas",
        observacoes: "Procedimento sem intercorrências",
        resumo:
          "Apendicectomia laparoscópica realizada sem complicações. Paciente apresentou boa evolução pós-operatória com alta no 2º dia.",
        timeline: [
          { tempo: "08:00", evento: "Entrada em sala", usuario: "Tec. Ana Costa" },
          { tempo: "08:15", evento: "Início da anestesia", usuario: "Tec. Ana Costa" },
          { tempo: "08:30", evento: "Início da cirurgia", usuario: "Tec. Ana Costa" },
          { tempo: "09:15", evento: "Fim da cirurgia", usuario: "Tec. Ana Costa" },
          { tempo: "09:30", evento: "Transferido para SRPA", usuario: "Tec. Ana Costa" },
        ],
      },
      {
        id: "hist2",
        data: "22/08/2021",
        procedimento: "Colecistectomia",
        cirurgiao: "Dr. Maria Oliveira",
        hospital: "Hospital Central",
        observacoes: "Cirurgia videolaparoscópica, sem intercorrências",
        resumo:
          "Colecistectomia videolaparoscópica por colelitíase sintomática. Procedimento transcorreu sem complicações, com boa recuperação anestésica.",
        timeline: [
          { tempo: "14:00", evento: "Entrada em sala", usuario: "Tec. Carlos Lima" },
          { tempo: "14:20", evento: "Início da anestesia", usuario: "Dr. Roberto" },
          { tempo: "14:35", evento: "Início da cirurgia", usuario: "Dr. Maria Oliveira" },
          { tempo: "15:45", evento: "Fim da cirurgia", usuario: "Dr. Maria Oliveira" },
          { tempo: "16:00", evento: "Transferido para SRPA", usuario: "Tec. Carlos Lima" },
        ],
      },
    ],
    acompanhantes: [
      { nome: "Maria Moreira", parentesco: "Esposa", telefone: "(11) 98888-8888", receberNotificacoes: true },
      { nome: "Pedro Moreira", parentesco: "Filho", telefone: "(11) 97777-7777", receberNotificacoes: true },
    ],
    timeline: [
      {
        tempo: "06:30",
        evento: "Paciente admitido na unidade",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T09:30:00Z",
        duracao: 30,
      },
      {
        tempo: "07:00",
        evento: "Preparação pré-operatória iniciada",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T10:00:00Z",
        duracao: 15,
      },
      {
        tempo: "07:15",
        evento: "Entrada em sala cirúrgica",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T10:15:00Z",
        duracao: 15,
      },
      {
        tempo: "07:30",
        evento: "Início da anestesia",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T10:30:00Z",
        duracao: 15,
      },
      {
        tempo: "07:45",
        evento: "Início da cirurgia",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T10:45:00Z",
        duracao: 45,
      },
      {
        tempo: "08:30",
        evento: "Fim da cirurgia",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T11:30:00Z",
        duracao: 15,
      },
      {
        tempo: "08:45",
        evento: "Fim da anestesia",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T11:45:00Z",
        duracao: 15,
      },
      {
        tempo: "09:00",
        evento: "Transferido para SRPA",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T12:00:00Z",
      },
    ],
    registro: "12345",
    dataCirurgia: "2024-01-05",
    horario: "07:30",
  },
  "2": {
    id: "2",
    nome: "Maria Silva Santos",
    idade: 38,
    dataNascimento: "22/07/1986",
    cpf: "987.654.321-00",
    rg: "98.765.432-1",
    endereco: "Av. Paulista, 456 - Bela Vista - São Paulo/SP",
    telefone: "(11) 88888-8888",
    email: "maria.santos@email.com",
    convenio: "BRADESCO SAÚDE",
    numeroCartao: "987654321098765",
    procedimento: "Colecistectomia Videolaparoscópica",
    cirurgiao: "Dr. Ana Paula Costa",
    anestesista: "Dr. Roberto Lima",
    instrumentadora: "Enf. João Oliveira",
    sala: 2,
    status: "EM CIRURGIA",
    lateralidade: "N/A",
    alergias: "Látex",
    descricaoAlergias: "Alergia ao látex com manifestações cutâneas (urticária e prurido).",
    observacoes: "Paciente diabética tipo 2, em uso de Metformina 850mg",
    contatoEmergencia: "Carlos Santos (Esposo)",
    telefoneEmergencia: "(11) 77777-7777",
    avaliacaoPreAnestesica: "",
    horarios: [
      { tipo: "ENTRADA EM SALA", horario: "08:00", usuario: "Tec. Pedro Pedroso", timestamp: "2025-01-04T11:00:00Z" },
      {
        tipo: "INÍCIO DA ANESTESIA",
        horario: "08:15",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T11:15:00Z",
      },
      {
        tipo: "INÍCIO DA CIRURGIA",
        horario: "08:30",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T11:30:00Z",
      },
    ],
    historico: [
      {
        id: "hist3",
        data: "10/12/2022",
        procedimento: "Cesariana",
        cirurgiao: "Dr. Patricia Mendes",
        hospital: "Maternidade Santa Clara",
        observacoes: "Parto cesáreo sem intercorrências, RN saudável",
        resumo:
          "Cesariana eletiva a termo. Procedimento transcorreu sem complicações, recém-nascido com boa vitalidade.",
        timeline: [
          { tempo: "09:00", evento: "Entrada em sala", usuario: "Tec. Lucia Santos" },
          { tempo: "09:15", evento: "Raquianestesia", usuario: "Dr. Fernando" },
          { tempo: "09:30", evento: "Início da cirurgia", usuario: "Dr. Patricia Mendes" },
          { tempo: "10:15", evento: "Nascimento do RN", usuario: "Dr. Patricia Mendes" },
          { tempo: "10:45", evento: "Fim da cirurgia", usuario: "Dr. Patricia Mendes" },
        ],
      },
    ],
    acompanhantes: [
      { nome: "Carlos Santos", parentesco: "Esposo", telefone: "(11) 77777-7777", receberNotificacoes: true },
    ],
    timeline: [
      {
        tempo: "07:00",
        evento: "Paciente admitida na unidade",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T10:00:00Z",
        duracao: 60,
      },
      {
        tempo: "08:00",
        evento: "Entrada em sala cirúrgica",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T11:00:00Z",
        duracao: 15,
      },
      {
        tempo: "08:15",
        evento: "Início da anestesia",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T11:15:00Z",
        duracao: 15,
      },
      {
        tempo: "08:30",
        evento: "Início da cirurgia",
        usuario: "Tec. Pedro Pedroso",
        timestamp: "2025-01-04T11:30:00Z",
      },
    ],
    registro: "54321",
    dataCirurgia: "2024-01-05",
    horario: "08:30",
  },
}

const statusOptions = [
  "EXTERNO",
  "INTERNAÇÃO",
  "APO",
  "CHAMADO",
  "EM ANDAMENTO",
  "SRPA",
  "ALTA",
  "CTI",
  "ENFERMARIA",
  "QUARTO",
  "SUSPENSA",
  "OUTRO",
]

const statusColors: Record<string, string> = {
  EXTERNO: "bg-gray-500 text-white",
  INTERNAÇÃO: "bg-blue-500 text-white",
  APO: "bg-purple-500 text-white",
  CHAMADO: "bg-yellow-500 text-black",
  "EM ANDAMENTO": "bg-green-500 text-white",
  SRPA: "bg-orange-500 text-white",
  ALTA: "bg-teal-500 text-white",
  CTI: "bg-red-500 text-white",
  ENFERMARIA: "bg-indigo-500 text-white",
  QUARTO: "bg-pink-500 text-white",
  SUSPENSA: "bg-gray-700 text-white",
  OUTRO: "bg-slate-500 text-white",
}

export default function PainelPaciente() {
  const searchParams = useSearchParams()
  const pacienteId = searchParams.get("id")
  const { toast } = useToast()

  const [paciente, setPaciente] = useState<PacienteCompleto>(
    pacienteId ? pacientesData[pacienteId] : pacientesData["1"]
  )

  // Estados para edição
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState("")
  const [editedFields, setEditedFields] = useState<Record<string, { usuario: string; timestamp: string }>>({})

  const [showTimeInput, setShowTimeInput] = useState(false)
  const [manualTime, setManualTime] = useState("")
  const [selectedTimeType, setSelectedTimeType] = useState("")
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState<any>(null)
  const [showNewContactDialog, setShowNewContactDialog] = useState(false)
  const [newContact, setNewContact] = useState({ nome: "", parentesco: "", telefone: "", receberNotificacoes: true })

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
        [field]: { usuario: "Tec. Pedro Pedroso", timestamp: new Date().toLocaleString("pt-BR") },
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

  const handleStatusSave = () => {
    setConfirmMessage(`Confirmar alteração do status para ${tempValue}?`)
    setConfirmAction(() => () => {
      setPaciente((prev) => ({ ...prev, status: tempValue }))
      setEditedFields((prev) => ({
        ...prev,
        status: { usuario: "Tec. Pedro Pedroso", timestamp: new Date().toLocaleString("pt-BR") },
      }))
      setEditingField(null)
      setShowConfirmDialog(false)
      toast({
        title: "Status atualizado",
        description: `Status alterado para ${tempValue} com sucesso.`,
      })
    })
    setShowConfirmDialog(true)
  }

  const handleManualTimeAdd = () => {
    if (!manualTime || !selectedTimeType) return

    setConfirmMessage(`Confirmar registro de ${selectedTimeType} às ${manualTime}?`)
    setConfirmAction(() => () => {
      const novoHorario: Horario = {
        tipo: selectedTimeType,
        horario: manualTime,
        usuario: "Tec. Pedro Pedroso",
        timestamp: new Date().toISOString(),
      }
      setPaciente((prev) => ({
        ...prev,
        horarios: [...prev.horarios, novoHorario],
      }))
      setShowTimeInput(false)
      setManualTime("")
      setSelectedTimeType("")
      setShowConfirmDialog(false)
      toast({
        title: "Horário registrado",
        description: `${selectedTimeType} registrado às ${manualTime}`,
      })
    })
    setShowConfirmDialog(true)
  }

  const handleShareTimeline = (acompanhante: any) => {
    navigator.clipboard.writeText(`https://hospital.com/timeline/${paciente.id}`)
    toast({
      title: "Link copiado",
      description: "Link da timeline copiado para a área de transferência",
    })
  }

  const handleAddContact = () => {
    setConfirmMessage(`Confirmar cadastro do acompanhante ${newContact.nome}?`)
    setConfirmAction(() => () => {
      setPaciente((prev) => ({
        ...prev,
        acompanhantes: [...prev.acompanhantes, newContact],
      }))
      setNewContact({ nome: "", parentesco: "", telefone: "", receberNotificacoes: true })
      setShowNewContactDialog(false)
      setShowConfirmDialog(false)
      toast({
        title: "Acompanhante cadastrado",
        description: `${newContact.nome} foi adicionado com sucesso.`,
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

  const horariosRegistrados = paciente.horarios.map((h) => h.tipo)
  const horariosDisponiveis = tiposHorario.filter((tipo) => !horariosRegistrados.includes(tipo))

  const handleQuickTimeRegister = (tipo: string) => {
    const now = new Date()
    const horarioAtual = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

    const novoHorario = {
      tipo,
      horario: horarioAtual,
      usuario: "Tec. Pedro Pedroso",
      timestamp: now.toISOString(),
    }

    setPaciente((prev) => ({
      ...prev,
      horarios: [...prev.horarios, novoHorario],
    }))

    setEditedFields((prev) => ({
      ...prev,
      [`horario-${paciente.horarios.length}`]: {
        usuario: "Tec. Pedro Pedroso",
        timestamp: new Date().toLocaleString("pt-BR"),
      },
    }))

    toast({
      title: "Horário registrado",
      description: `${tipo} registrado às ${horarioAtual}`,
    })
  }

  const handleSaveHorario = (index: number) => {
    setConfirmMessage(`Confirmar alteração do horário?`)
    setConfirmAction(() => () => {
      setPaciente((prev) => ({
        ...prev,
        horarios: prev.horarios.map((h, i) => (i === index ? { ...h, horario: tempValue } : h)),
      }))
      setEditedFields((prev) => ({
        ...prev,
        [`horario-${index}`]: {
          usuario: "Tec. Pedro Pedroso",
          timestamp: new Date().toLocaleString("pt-BR"),
        },
      }))
      setEditingField(null)
      setShowConfirmDialog(false)
      toast({
        title: "Horário atualizado",
        description: `Horário foi alterado com sucesso.`,
      })
    })
    setShowConfirmDialog(true)
  }

  const handleEditAcompanhante = (index: number, field: string, currentValue: string) => {
    setEditingField(`acompanhante-${index}-${field}`)
    setTempValue(currentValue)
  }

  const handleSaveAcompanhante = (index: number, field: string) => {
    setConfirmMessage(`Confirmar alteração do ${field} do acompanhante?`)
    setConfirmAction(() => () => {
      setPaciente((prev) => ({
        ...prev,
        acompanhantes: prev.acompanhantes.map((acomp, i) => (i === index ? { ...acomp, [field]: tempValue } : acomp)),
      }))
      setEditedFields((prev) => ({
        ...prev,
        [`acompanhante-${index}-${field}`]: {
          usuario: "Tec. Pedro Pedroso",
          timestamp: new Date().toLocaleString("pt-BR"),
        },
      }))
      setEditingField(null)
      setShowConfirmDialog(false)
      toast({
        title: "Acompanhante atualizado",
        description: `${field} foi alterado com sucesso.`,
      })
    })
    setShowConfirmDialog(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header com informações do paciente */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/mapa-cirurgico">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div>
                <CardTitle className="text-2xl font-bold">{paciente.nome}</CardTitle>
                <p className="text-gray-600">Registro: {paciente.registro}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                {editingField === "status" ? (
                  <div className="flex items-center gap-2">
                    <Select value={tempValue} onValueChange={setTempValue}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleStatusSave}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${statusColors[paciente.status]} text-lg px-4 py-2 cursor-pointer hover:opacity-80`}
                      onClick={() => handleEdit("status", paciente.status)}
                    >
                      {paciente.status}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit("status", paciente.status)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
              <TabsTrigger value="horarios">Horários</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="acompanhantes">Acompanhantes</TabsTrigger>
            </TabsList>

            {/* Aba Dados Gerais */}
            <TabsContent value="geral">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Dados Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {[
                        { label: "Nome", field: "nome", value: paciente.nome },
                        {
                          label: "Data de Nascimento",
                          field: "dataNascimento",
                          value: paciente.dataNascimento || "15/03/1985",
                        },
                        { label: "Idade", field: "idade", value: `${paciente.idade} anos` },
                        { label: "CPF", field: "cpf", value: paciente.cpf },
                        { label: "Telefone", field: "telefone", value: paciente.telefone },
                        { label: "Endereço", field: "endereco", value: paciente.endereco },
                        {
                          label: "Descrição Alergias",
                          field: "alergias",
                          value: paciente.alergias || "Nenhuma alergia conhecida",
                        },
                      ].map((item, index) => (
                        <div
                          key={item.field}
                          className={`flex items-center justify-between p-3 border rounded ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } border-gray-200`}
                        >
                          <div className="flex-1">
                            {editingField === item.field ? (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700 w-32">{item.label}:</span>
                                <Input
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  className="flex-1"
                                />
                                <Button size="sm" onClick={() => handleSave(item.field)}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span className="font-medium text-gray-700">{item.label}:</span>
                                <span className="ml-2">{item.value}</span>
                              </>
                            )}
                          </div>
                          {editingField !== item.field && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(item.field, item.value)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Dados do Procedimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {[
                        { label: "Procedimento", field: "procedimento", value: paciente.procedimento },
                        { label: "Cirurgião", field: "cirurgiao", value: paciente.cirurgiao },
                        { label: "Data da Cirurgia", field: "dataCirurgia", value: paciente.dataCirurgia },
                        { label: "Horário", field: "horario", value: paciente.horario },
                        { label: "Sala", field: "sala", value: `Sala ${paciente.sala}` },
                        { label: "Convênio", field: "convenio", value: paciente.convenio },
                      ].map((item, index) => (
                        <div
                          key={item.field}
                          className={`flex items-center justify-between p-3 border rounded ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } border-gray-200`}
                        >
                          <div className="flex-1">
                            {editingField === item.field ? (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700 w-32">{item.label}:</span>
                                <Input
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  className="flex-1"
                                />
                                <Button size="sm" onClick={() => handleSave(item.field)}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span className="font-medium text-gray-700">{item.label}:</span>
                                <span className="ml-2">{item.value}</span>
                              </>
                            )}
                          </div>
                          {editingField !== item.field && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(item.field, item.value)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Avaliação Pré-anestésica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="avaliacao">Iniciar Avaliação</Label>
                      <Textarea
                        id="avaliacao"
                        placeholder="Digite aqui a avaliação pré-anestésica..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button>Salvar Avaliação</Button>
                  </div>
                </CardContent>
              </Card>
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
                        {paciente.horarios.length > 0 ? (
                          paciente.horarios.map((horario, index) => {
                            const isRedType = ["FIM DA CIRURGIA", "FIM DA ANESTESIA", "SAÍDA DE SALA"].includes(
                              horario.tipo,
                            )
                            return (
                              <div
                                key={index}
                                className={`flex items-center justify-between p-4 rounded-lg border ${
                                  isRedType ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
                                }`}
                              >
                                <div>
                                  <span className={`font-semibold ${isRedType ? "text-red-800" : "text-green-800"}`}>
                                    {horario.tipo}
                                  </span>
                                  <p className="text-sm text-gray-600">
                                    Registrado por {horario.usuario} em{" "}
                                    {new Date(horario.timestamp).toLocaleString("pt-BR")}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {editingField === `horario-${index}` ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="time"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        className="w-24"
                                      />
                                      <Button size="sm" onClick={() => handleSaveHorario(index)}>
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      <span
                                        className={`text-2xl font-bold ${isRedType ? "text-red-700" : "text-green-700"}`}
                                      >
                                        {horario.horario}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEdit(`horario-${index}`, horario.horario)}
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-gray-500">Nenhum horário registrado para este paciente.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Registrar Horários</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Button
                          variant="outline"
                          className="p-4 h-auto flex flex-col items-center gap-2 hover:bg-red-50 bg-transparent border-red-200"
                          onClick={() => handleQuickTimeRegister("FIM DA CIRURGIA")}
                        >
                          <Clock className="h-5 w-5 text-red-600" />
                          <span className="text-sm font-medium text-center text-red-700">FIM DA CIRURGIA</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="p-4 h-auto flex flex-col items-center gap-2 hover:bg-red-50 bg-transparent border-red-200"
                          onClick={() => handleQuickTimeRegister("FIM DA ANESTESIA")}
                        >
                          <Clock className="h-5 w-5 text-red-600" />
                          <span className="text-sm font-medium text-center text-red-700">FIM DA ANESTESIA</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="p-4 h-auto flex flex-col items-center gap-2 hover:bg-red-50 bg-transparent border-red-200"
                          onClick={() => handleQuickTimeRegister("SAÍDA DE SALA")}
                        >
                          <Clock className="h-5 w-5 text-red-600" />
                          <span className="text-sm font-medium text-center text-red-700">SAÍDA DE SALA</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline do Procedimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paciente.timeline.length > 0 ? (
                      paciente.timeline.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                        >
                          <div className="flex-shrink-0 w-16 text-sm font-semibold text-blue-600">{item.tempo}</div>
                          <div className="flex-1">
                            <p className="font-medium">{item.evento}</p>
                            <p className="text-sm text-gray-600">Por: {item.usuario}</p>
                            {item.duracao && index < paciente.timeline.length - 1 && (
                              <p className="text-xs text-orange-600 mt-1">Duração: {item.duracao} minutos</p>
                            )}
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
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setSelectedHistory(proc)
                            setShowHistoryDialog(true)
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-blue-600 hover:text-blue-800">{proc.procedimento}</h3>
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

            {/* Aba Acompanhantes */}
            <TabsContent value="acompanhantes">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Acompanhantes
                    </CardTitle>
                    <Button onClick={() => setShowNewContactDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Acompanhante
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paciente.acompanhantes.length > 0 ? (
                      paciente.acompanhantes.map((contato, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium w-16">Nome:</span>
                              {editingField === `acompanhante-${index}-nome` ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    value={tempValue}
                                    onChange={(e) => setNewContact((prev) => ({ ...prev, nome: e.target.value }))}
                                    className="flex-1"
                                  />
                                  <Button size="sm" onClick={() => handleSaveAcompanhante(index, "nome")}>
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="font-semibold">{contato.nome}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditAcompanhante(index, "nome", contato.nome)}
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-medium w-20">Parentesco:</span>
                              {editingField === `acompanhante-${index}-parentesco` ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button size="sm" onClick={() => handleSaveAcompanhante(index, "parentesco")}>
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-gray-600 ml-2">{contato.parentesco}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditAcompanhante(index, "parentesco", contato.parentesco)}
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-medium w-16">Telefone:</span>
                              {editingField === `acompanhante-${index}-telefone` ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button size="sm" onClick={() => handleSaveAcompanhante(index, "telefone")}>
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-gray-600">{contato.telefone}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditAcompanhante(index, "telefone", contato.telefone)}
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant={contato.receberNotificacoes ? "default" : "secondary"}>
                              {contato.receberNotificacoes ? "Ativo" : "Inativo"}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => handleShareTimeline(contato)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Nenhum acompanhante registrado para este paciente.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showTimeInput} onOpenChange={setShowTimeInput}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar {selectedTimeType}</DialogTitle>
            <DialogDescription>Digite o horário manualmente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Horário</Label>
              <Input
                type="time"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimeInput(false)}>
              Cancelar
            </Button>
            <Button onClick={handleManualTimeAdd}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedHistory?.procedimento}</DialogTitle>
            <DialogDescription>{selectedHistory?.data}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Resumo Técnico</h4>
              <p className="text-sm text-gray-700">{selectedHistory?.resumo}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Timeline do Procedimento</h4>
              <div className="space-y-2">
                {selectedHistory?.timeline?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-blue-600 w-16">{item.tempo}</span>
                    <span className="text-sm flex-1">{item.evento}</span>
                    <span className="text-xs text-gray-500">{item.usuario}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHistoryDialog(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewContactDialog} onOpenChange={setShowNewContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Acompanhante</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={newContact.nome}
                onChange={(e) => setNewContact((prev) => ({ ...prev, nome: e.target.value }))}
              />
            </div>
            <div>
              <Label>Parentesco</Label>
              <Input
                value={newContact.parentesco}
                onChange={(e) => setNewContact((prev) => ({ ...prev, parentesco: e.target.value }))}
              />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input
                value={newContact.telefone}
                onChange={(e) => setNewContact((prev) => ({ ...prev, telefone: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewContactDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddContact}>Cadastrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
