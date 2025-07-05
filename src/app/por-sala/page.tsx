"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, Info, Check, X, ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  | "Disponível"

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
  auxiliar?: string
  anestesista?: string
  instrumentador?: string
  circulante?: string
  inicio?: string
  termino?: string
  alergia?: string | null
  jejum?: "ADEQUADO" | "INADEQUADO"
  materiais?: "COMPLETOS" | "INCOMPLETOS"
  timeline?: {
    hora: string
    status: string
    concluido: boolean
  }[]
}

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
  Disponível: "bg-blue-500 text-white",
}

// Dados dos pacientes com status EM ANDAMENTO do mapa cirúrgico
const procedimentos: Procedimento[] = [
  {
    status: "Em andamento",
    sala: 2,
    horario: "07:00",
    paciente: "Luís Carlos Damasceno",
    idade: 68,
    procedimento: "Prostatectomia Radical Robótica",
    lateralidade: "N/A",
    cirurgiao: "Dr. Daniel Tavares",
    convenio: "UNIMED",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dr. Marcos Ribeiro",
    instrumentador: "Enf. Juliana Alves",
    circulante: "Amanda",
    inicio: "07:00",
    termino: "10:00",
    alergia: "MORFINA",
    jejum: "ADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "06:00", status: "Internação", concluido: true },
      { hora: "06:30", status: "APO", concluido: true },
      { hora: "07:00", status: "Chamado", concluido: true },
      { hora: "07:30", status: "Em procedimento", concluido: true },
      { hora: "09:30", status: "Finalização", concluido: false },
      { hora: "10:15", status: "Recuperação", concluido: false },
    ],
  },
  {
    status: "Em andamento",
    sala: 3,
    horario: "09:00",
    paciente: "Simone Meirelles Dutra",
    idade: 37,
    procedimento: "Colecistectomia Videolaparosc.",
    lateralidade: "N/A",
    cirurgiao: "Dr. Eduardo Ramos",
    convenio: "PARTICULAR",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dra. Patricia Alves",
    instrumentador: "Enf. Monica Silva",
    circulante: "Amanda",
    inicio: "09:00",
    termino: "11:00",
    alergia: "PENICILINA",
    jejum: "ADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "08:00", status: "Internação", concluido: true },
      { hora: "08:30", status: "APO", concluido: true },
      { hora: "09:00", status: "Chamado", concluido: true },
      { hora: "09:30", status: "Em procedimento", concluido: true },
      { hora: "10:30", status: "Finalização", concluido: false },
      { hora: "11:15", status: "Recuperação", concluido: false },
    ],
  },
  {
    status: "Em andamento",
    sala: 4,
    horario: "09:30",
    paciente: "Beatriz Antunes Ferreira",
    idade: 25,
    procedimento: "Artroplastia de quadril",
    lateralidade: "DIREITO",
    cirurgiao: "Dr. Carlos H. Bittencourt",
    convenio: "UNIMED",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dra. Juliana Mendes",
    instrumentador: "Enf. Fernanda Silva",
    circulante: "Amanda",
    inicio: "09:30",
    termino: "13:00",
    alergia: "LÁTEX, IODO",
    jejum: "ADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "08:30", status: "Internação", concluido: true },
      { hora: "09:00", status: "APO", concluido: true },
      { hora: "09:30", status: "Chamado", concluido: true },
      { hora: "10:00", status: "Em procedimento", concluido: true },
      { hora: "12:30", status: "Finalização", concluido: false },
      { hora: "13:15", status: "Recuperação", concluido: false },
    ],
  },
  {
    status: "Em andamento",
    sala: 5,
    horario: "07:45",
    paciente: "Bruno César Machado",
    idade: 22,
    procedimento: "Orquiectomia",
    lateralidade: "ESQUERDO",
    cirurgiao: "Dr. Henrique de Sá",
    convenio: "SULAMÉRICA",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dr. Rafael Costa",
    instrumentador: "Enf. Tatiana Lima",
    circulante: "Amanda",
    inicio: "07:45",
    termino: "09:30",
    alergia: null,
    jejum: "ADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "07:00", status: "Internação", concluido: true },
      { hora: "07:15", status: "APO", concluido: true },
      { hora: "07:45", status: "Chamado", concluido: true },
      { hora: "08:15", status: "Em procedimento", concluido: true },
      { hora: "09:00", status: "Finalização", concluido: false },
      { hora: "09:45", status: "Recuperação", concluido: false },
    ],
  },
  {
    status: "Disponível",
    sala: 1,
    horario: "",
    paciente: "",
    idade: 0,
    procedimento: "",
    lateralidade: "N/A",
    cirurgiao: "",
    convenio: "",
  },
  {
    status: "Disponível",
    sala: 6,
    horario: "",
    paciente: "",
    idade: 0,
    procedimento: "",
    lateralidade: "N/A",
    cirurgiao: "",
    convenio: "",
  },
  {
    status: "Disponível",
    sala: 7,
    horario: "",
    paciente: "",
    idade: 0,
    procedimento: "",
    lateralidade: "N/A",
    cirurgiao: "",
    convenio: "",
  },
  {
    status: "Disponível",
    sala: 8,
    horario: "",
    paciente: "",
    idade: 0,
    procedimento: "",
    lateralidade: "N/A",
    cirurgiao: "",
    convenio: "",
  },
  {
    status: "Disponível",
    sala: 9,
    horario: "",
    paciente: "",
    idade: 0,
    procedimento: "",
    lateralidade: "N/A",
    cirurgiao: "",
    convenio: "",
  },
]

export default function PorSala() {
  const [salaAberta, setSalaAberta] = useState<number | null>(null)

  const abrirDetalhesSala = (sala: number) => {
    setSalaAberta(sala)
  }

  const fecharDetalhesSala = () => {
    setSalaAberta(null)
  }

  const dadosSalaAtual = procedimentos.find((sala) => sala.sala === salaAberta)

  return (
    <div className="w-full h-full flex justify-center items-center p-3">
      <Card className="shadow-md">
        <CardHeader className="bg-white border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl font-bold">Mapa Cirúrgico em Tempo Real</CardTitle>
            <Link href="/mapa-cirurgico">
              <Button className="bg-blue-800 hover:bg-blue-700 text-white">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Mapa Cirúrgico
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {procedimentos.map((proc) => (
              <div
                key={proc.sala}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => abrirDetalhesSala(proc.sala)}
              >
                <div className="border-b bg-gray-50 py-2 px-4">
                  <h2 className="text-center font-bold">SALA {String(proc.sala).padStart(2, "0")}</h2>
                </div>
                {proc.status === "Disponível" ? (
                  <div className="p-4 bg-blue-100 flex flex-col items-center justify-center min-h-[200px]">
                    <Badge className={`${statusColors[proc.status]} font-normal mb-4 px-4 py-1 text-lg`}>
                      {proc.status}
                    </Badge>
                    <Calendar className="h-16 w-16 text-blue-500 mb-4" />
                    <p className="text-center font-medium">Sala disponível para agendamento</p>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Agendar Procedimento</Button>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50">
                    <div className="mb-3">
                      <div className="font-semibold text-center">
                        {proc.paciente} <span className="text-sm">{proc.idade}</span>
                      </div>
                      <div className="text-sm text-center font-medium flex items-center justify-center">
                        {proc.procedimento}
                        {proc.lateralidade !== "N/A" && ` - ${proc.lateralidade}`}
                        <Info className="ml-1 h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-xs space-y-1 mb-3">
                      <div>
                        <span className="font-semibold">Cirurgião:</span> {proc.cirurgiao}
                      </div>
                      {proc.auxiliar && (
                        <div>
                          <span className="font-semibold">Auxiliar:</span> {proc.auxiliar}
                        </div>
                      )}
                      {proc.anestesista && (
                        <div>
                          <span className="font-semibold">Anestesista:</span> {proc.anestesista}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold">Convênio:</span> {proc.convenio}
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span>{" "}
                        <Badge className={`${statusColors[proc.status]} font-normal`}>{proc.status}</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center">
                        <span className="font-semibold mr-1">HORÁRIO:</span> {proc.horario}
                      </div>
                      {proc.termino && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" /> {proc.termino}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>

        {/* Modal de detalhes */}
        <Dialog open={salaAberta !== null} onOpenChange={fecharDetalhesSala}>
          <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100">
            {dadosSalaAtual && dadosSalaAtual.status !== "Disponível" ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 mr-2" />
                    <span className="text-xl font-bold">{dadosSalaAtual?.termino}</span>
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold">CIRURGIA SEGURA</h2>
                  </div>
                  <div className="bg-black text-white px-3 py-1 rounded-full">
                    <span className="text-lg">{dadosSalaAtual?.inicio}</span>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold">
                    {dadosSalaAtual?.paciente} <span className="text-xl">{dadosSalaAtual?.idade}</span>
                  </h1>
                  <div className="bg-blue-200 inline-block px-4 py-1 rounded-md mt-2">
                    <span className="font-medium">
                      {dadosSalaAtual?.procedimento}
                      {dadosSalaAtual?.lateralidade !== "N/A" && ` - ${dadosSalaAtual?.lateralidade}`}
                    </span>
                    <span className="ml-2 bg-purple-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center">
                      E
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between text-sm mb-6">
                  <div>
                    <span className="font-semibold">Cirurgião:</span> {dadosSalaAtual?.cirurgiao}
                  </div>
                  <div>
                    <span className="font-semibold">Auxiliar:</span> {dadosSalaAtual?.auxiliar}
                  </div>
                  <div>
                    <span className="font-semibold">Anestesista:</span> {dadosSalaAtual?.anestesista}
                  </div>
                  <div>
                    <span className="font-semibold">Circulante:</span> {dadosSalaAtual?.circulante}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div
                    className={`p-4 rounded-md text-center ${dadosSalaAtual?.alergia ? "bg-red-100" : "bg-green-100"}`}
                  >
                    <div className="text-red-500 font-semibold">ALERGIA</div>
                    <div className="mt-2">
                      {dadosSalaAtual?.alergia ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-red-500 text-white rounded-md p-2 mb-2">
                            <Check className="h-6 w-6" />
                          </div>
                          <span className="font-bold">{dadosSalaAtual.alergia}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-green-500 text-white rounded-md p-2 mb-2">
                            <X className="h-6 w-6" />
                          </div>
                          <span className="font-bold">NENHUMA</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-md text-center ${
                      dadosSalaAtual?.jejum === "ADEQUADO" ? "bg-blue-100" : "bg-red-100"
                    }`}
                  >
                    <div className="text-blue-500 font-semibold">JEJUM</div>
                    <div className="mt-2">
                      <div className="flex flex-col items-center">
                        <div
                          className={`${
                            dadosSalaAtual?.jejum === "ADEQUADO" ? "bg-blue-500" : "bg-red-500"
                          } text-white rounded-md p-2 mb-2`}
                        >
                          <Check className="h-6 w-6" />
                        </div>
                        <span className="font-bold">{dadosSalaAtual?.jejum}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-md text-center ${
                      dadosSalaAtual?.materiais === "COMPLETOS" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <div className="text-green-500 font-semibold">MATERIAIS</div>
                    <div className="mt-2">
                      <div className="flex flex-col items-center">
                        <div
                          className={`${
                            dadosSalaAtual?.materiais === "COMPLETOS" ? "bg-green-500" : "bg-red-500"
                          } text-white rounded-md p-2 mb-2`}
                        >
                          <Check className="h-6 w-6" />
                        </div>
                        <span className="font-bold">{dadosSalaAtual?.materiais}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {dadosSalaAtual?.timeline && (
                  <div className="mb-4">
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        {dadosSalaAtual.timeline.map((item, index) => (
                          <div key={index} className="text-center">
                            <div className="text-xs font-medium">{item.hora}</div>
                          </div>
                        ))}
                      </div>
                      <div className="h-1 bg-gray-300 relative">
                        {dadosSalaAtual.timeline.map((item, index, arr) => {
                          const percentagem = (index / (arr.length - 1)) * 100
                          return (
                            <div
                              key={index}
                              className={`absolute w-6 h-6 rounded-full -mt-2.5 -ml-3 flex items-center justify-center ${
                                item.concluido
                                  ? "bg-green-500"
                                  : index === arr.findIndex((i) => !i.concluido)
                                    ? "bg-green-300"
                                    : "bg-orange-400"
                              }`}
                              style={{ left: `${percentagem}%` }}
                            >
                              {item.concluido && <Check className="h-4 w-4 text-white" />}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between mt-2">
                        {dadosSalaAtual.timeline.map((item, index) => (
                          <div key={index} className="text-center">
                            <div className="text-xs">{item.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <div className="bg-blue-200 px-4 py-1 rounded-md">
                    <span className="font-medium">Convênio: {dadosSalaAtual?.convenio}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center">
                <Calendar className="h-24 w-24 text-blue-500 mb-6" />
                <h2 className="text-2xl font-bold mb-4">Sala Disponível</h2>
                <p className="text-center mb-6">
                  Esta sala está disponível para agendamento de procedimentos cirúrgicos.
                </p>
                <Link href="/agendar-procedimentos">
                  <Button className="bg-blue-600 hover:bg-blue-700">Agendar Procedimento</Button>
                </Link>
              </div>
            )}
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}
