"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, User, FileText, Phone, History, Edit2, Check, X, AlertTriangle } from "lucide-react"
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

interface PacienteData {
  id: number
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
  status: string
  lateralidade: string
  alergias: string
  observacoes: string
  contatoEmergencia: string
  telefoneEmergencia: string
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

export default function PainelPaciente({ }: {  }) {
  const router = useRouter()
  const { toast } = useToast()

  // Dados fictícios do paciente
  const [pacienteData, setPacienteData] = useState<PacienteData>({
    id: 1,
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
  })

  // Horários importantes
  const [horarios, setHorarios] = useState<Horario[]>([
    { tipo: "ENTRADA EM SALA", horario: "07:15", usuario: "Enf. Ana Silva", timestamp: "2025-01-04 07:15:00" },
    { tipo: "INÍCIO DA ANESTESIA", horario: "07:30", usuario: "Dr. Carlos Silva", timestamp: "2025-01-04 07:30:00" },
    { tipo: "INÍCIO DA CIRURGIA", horario: "07:45", usuario: "Dr. Ricardo Salles", timestamp: "2025-01-04 07:45:00" },
  ])

  // Histórico de procedimentos
  const [historico] = useState<HistoricoProcedimento[]>([
    {
      data: "15/03/2023",
      procedimento: "Apendicectomia",
      cirurgiao: "Dr. João Santos",
      hospital: "Hospital São Lucas",
      observacoes: "Procedimento sem intercorrências",
    },
    {
      data: "22/08/2021",
      procedimento: "Colecistectomia Videolaparoscópica",
      cirurgiao: "Dr. Pedro Lima",
      hospital: "Hospital Central",
      observacoes: "Recuperação excelente",
    },
  ])

  // Contatos familiares
  const [contatosFamiliares, setContatosFamiliares] = useState<ContatoFamiliar[]>([
    { nome: "Maria Moreira", parentesco: "Esposa", telefone: "(11) 98888-8888", receberNotificacoes: true },
    { nome: "Pedro Moreira", parentesco: "Filho", telefone: "(11) 97777-7777", receberNotificacoes: true },
    { nome: "Ana Moreira", parentesco: "Filha", telefone: "(11) 96666-6666", receberNotificacoes: false },
  ])

  // Estados para edição
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmMessage, setConfirmMessage] = useState("")
  const [editedFields, setEditedFields] = useState<Record<string, { usuario: string; timestamp: string }>>({})

  // Timeline do procedimento
  const timeline = [
    { tempo: "06:30", evento: "Paciente admitido na unidade", usuario: "Recepção" },
    { tempo: "07:00", evento: "Preparação pré-operatória iniciada", usuario: "Enf. Ana Silva" },
    { tempo: "07:15", evento: "Entrada em sala cirúrgica", usuario: "Enf. Ana Silva" },
    { tempo: "07:30", evento: "Início da anestesia", usuario: "Dr. Carlos Silva" },
    { tempo: "07:45", evento: "Início da cirurgia", usuario: "Dr. Ricardo Salles" },
    { tempo: "08:30", evento: "Fim da cirurgia", usuario: "Dr. Ricardo Salles" },
    { tempo: "08:45", evento: "Fim da anestesia", usuario: "Dr. Carlos Silva" },
    { tempo: "09:00", evento: "Transferido para SRPA", usuario: "Enf. Ana Silva" },
  ]

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field)
    setTempValue(currentValue)
  }

  const handleSave = (field: string) => {
    setConfirmMessage(`Confirmar alteração do campo ${field}?`)
    setConfirmAction(() => () => {
      setPacienteData((prev) => ({ ...prev, [field]: tempValue }))
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
        usuario: "Dr. João Silva",
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
              <h1 className="text-3xl font-bold text-gray-900">{pacienteData.nome}</h1>
              <p className="text-gray-600">
                {pacienteData.procedimento} - Sala {pacienteData.sala}
              </p>
            </div>
            <Badge className="text-lg px-4 py-2 bg-orange-200 text-black border border-orange-500">
              {pacienteData.status}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="horarios">Horários</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="familiares">Familiares</TabsTrigger>
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
                            <span className="flex-1">{pacienteData[key as keyof PacienteData]}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(key, String(pacienteData[key as keyof PacienteData]))}
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
                            <span className="flex-1">{pacienteData[key as keyof PacienteData]}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(key, String(pacienteData[key as keyof PacienteData]))}
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
                              {pacienteData.alergias}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit("alergias", pacienteData.alergias)}
                            >
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
                              {pacienteData.observacoes}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit("observacoes", pacienteData.observacoes)}
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
                      {horarios.map((horario, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div>
                            <span className="font-semibold text-green-800">{horario.tipo}</span>
                            <p className="text-sm text-gray-600">
                              Registrado por {horario.usuario} em {new Date(horario.timestamp).toLocaleString("pt-BR")}
                            </p>
                          </div>
                          <span className="text-2xl font-bold text-green-700">{horario.horario}</span>
                        </div>
                      ))}
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
                  {timeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex-shrink-0 w-16 text-sm font-semibold text-blue-600">{item.tempo}</div>
                      <div className="flex-1">
                        <p className="font-medium">{item.evento}</p>
                        <p className="text-sm text-gray-600">Por: {item.usuario}</p>
                      </div>
                    </div>
                  ))}
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
                  {historico.map((proc, index) => (
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
                  ))}
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
                  {contatosFamiliares.map((contato, index) => (
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
                  ))}
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