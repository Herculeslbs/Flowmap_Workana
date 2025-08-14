"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, Home, Calendar, Users, ClipboardList, FileText, BarChart3, Map, Settings, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend } from "@/components/ui/chart"
import { Tooltip,YAxis, XAxis, ResponsiveContainer, BarChart,Bar, Pie, Cell } from "recharts"
import { Clock, TrendingUp, CalendarCheck, Ban } from 'lucide-react'


interface MenuItem {
  title: string
  href: string
  icon: React.ReactNode
  description?: string
}

const menuItems: MenuItem[] = [
  {
    title: "Home",
    href: "/tela-operador",
    icon: <Home className="h-4 w-4" />,
    description: "Painel do operador",
  },
  {
    title: "Login",
    href: "/login",
    icon: <User className="h-4 w-4" />,
    description: "Tela de autenticação",
  },
  {
    title: "Equipes Cirúrgicas Operador",
    href: "/equipescirurgicas-operador",
    icon: <Users className="h-4 w-4" />,
    description: "Painel de equipes do operador",
  },
  {
    title: "Analisar Solicitações",
    href: "/analisar-solicitacoes",
    icon: <ClipboardList className="h-4 w-4" />,
    description: "Análise de solicitações",
  },
  {
    title: "Gerenciar Mapa",
    href: "/gerenciar-mapa",
    icon: <Calendar className="h-4 w-4" />,
    description: "Gerenciamento de mapas",
  },
  {
    title: "Mapa do Dia",
    href: "/mapa-do-dia",
    icon: <Calendar className="h-4 w-4" />,
    description: "Mapa cirúrgico do dia",
  },
  {
    title: "Mapas Preliminares",
    href: "/mapas-preliminares",
    icon: <CalendarCheck className="h-4 w-4" />,
    description: "Mapas futuros",
  },
]

export default function HamburgerMenu() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showReports, setShowReports] = useState(false)

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  // Dados fictícios para os relatórios (mesmos do painel-paciente)
  const pacientesData = [
    {
      id: "1",
      nome: "João Batista Moreira",
      status: "ALTA",
      procedimento: "Herniorrafia Inguinal",
      cirurgiao: "Dr. Ricardo Salles",
      durationMinutes: 45,
      timeline: [
        { tempo: "06:30", evento: "Paciente admitido na unidade", timestamp: "2025-01-04T09:30:00Z" },
        { tempo: "07:45", evento: "Início da cirurgia", timestamp: "2025-01-04T10:45:00Z" },
        { tempo: "08:30", evento: "Fim da cirurgia", timestamp: "2025-01-04T11:30:00Z" },
        { tempo: "09:00", evento: "Transferido para SRPA", timestamp: "2025-01-04T12:00:00Z" },
        { tempo: "10:00", evento: "Saída da SRPA para Quarto", timestamp: "2025-01-04T13:00:00Z" },
        { tempo: "15:00", evento: "Paciente recebeu alta", timestamp: "2025-01-04T18:00:00Z" },
      ],
    },
    {
      id: "2",
      nome: "Ana Paula Costa",
      status: "ALTA",
      procedimento: "Colecistectomia",
      cirurgiao: "Dr. Fernanda Lima",
      durationMinutes: 75,
      timeline: [
        { tempo: "07:30", evento: "Paciente admitido na unidade", timestamp: "2025-01-05T10:30:00Z" },
        { tempo: "08:30", evento: "Início da cirurgia", timestamp: "2025-01-05T11:30:00Z" },
        { tempo: "09:45", evento: "Fim da cirurgia", timestamp: "2025-01-05T12:45:00Z" },
        { tempo: "10:15", evento: "Transferido para SRPA", timestamp: "2025-01-05T13:15:00Z" },
        { tempo: "11:30", evento: "Saída da SRPA para Quarto", timestamp: "2025-01-05T14:30:00Z" },
        { tempo: "16:00", evento: "Paciente recebeu alta", timestamp: "2025-01-05T19:00:00Z" },
      ],
    },
    {
      id: "3",
      nome: "Pedro Henrique Santos",
      status: "CANCELADO",
      procedimento: "Catarata",
      cirurgiao: "Dr. Lucas Mendes",
      cancellationReason: "Paciente não compareceu",
      durationMinutes: 0,
      timeline: [
        { tempo: "07:00", evento: "Paciente admitido na unidade", timestamp: "2025-01-06T10:00:00Z" },
        { tempo: "07:30", evento: "Cirurgia cancelada", timestamp: "2025-01-06T10:30:00Z" },
      ],
    },
    {
      id: "4",
      nome: "Mariana Oliveira",
      status: "EM ANDAMENTO",
      procedimento: "Rinoplastia",
      cirurgiao: "Dr. Helena Costa",
      durationMinutes: undefined,
      timeline: [
        { tempo: "08:30", evento: "Paciente admitido na unidade", timestamp: "2025-01-07T11:30:00Z" },
        { tempo: "09:45", evento: "Início da cirurgia", timestamp: "2025-01-07T12:45:00Z" },
      ],
    },
    {
      id: "5",
      nome: "Carlos Eduardo Lima",
      status: "ALTA",
      procedimento: "Artroplastia de Quadril",
      cirurgiao: "Dr. Paulo Roberto",
      durationMinutes: 105,
      timeline: [
        { tempo: "09:30", evento: "Paciente admitido na unidade", timestamp: "2025-01-08T12:30:00Z" },
        { tempo: "10:45", evento: "Início da cirurgia", timestamp: "2025-01-08T13:45:00Z" },
        { tempo: "12:30", evento: "Fim da cirurgia", timestamp: "2025-01-08T15:30:00Z" },
        { tempo: "13:00", evento: "Transferido para SRPA", timestamp: "2025-01-08T16:00:00Z" },
        { tempo: "14:30", evento: "Saída da SRPA para Quarto", timestamp: "2025-01-08T17:30:00Z" },
        { tempo: "18:00", evento: "Paciente recebeu alta", timestamp: "2025-01-08T21:00:00Z" },
      ],
    },
  ]

  // Cálculos para estatísticas
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
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
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

  const timeStatsData = [
    { name: "Admissão até Cirurgia", value: avgAdmissionToSurgeryStart, unit: "min" },
    { name: "Fim Cirurgia até Alta", value: avgSurgeryEndToDischarge, unit: "min" },
    { name: "Permanência SRPA", value: avgSRPAStay, unit: "min" },
    { name: "Permanência Quarto", value: avgQuartoStay, unit: "min" },
  ].filter((item) => item.value !== null)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-white shadow-md hover:bg-gray-100 border"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center bg-[#1E40AF] text-white p-4 -m-6 mb-4">
              Menu de Navegação
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-blue-50"
                onClick={() => handleNavigation(item.href)}
              >
                <div className="flex items-center gap-3 w-full">
                  {item.icon}
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.title}</div>
                    {item.description && <div className="text-xs text-gray-500">{item.description}</div>}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <Dialog open={showReports} onOpenChange={setShowReports}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start h-auto p-3 bg-transparent">
                  <div className="flex items-center gap-3 w-full">
                    <BarChart3 className="h-4 w-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">Relatórios</div>
                      <div className="text-xs text-gray-500">Estatísticas e análises</div>
                    </div>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Relatórios do Sistema
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                  {/* Relatórios Estatísticos */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Relatórios Estatísticos</h3>

                    {/* Resumo das Cirurgias */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

                    {/* Média de Duração */}
                    <div className="flex items-center gap-2 mb-6">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <h4 className="text-lg font-semibold">Média de Duração dos Procedimentos Concluídos:</h4>
                      <span className="text-xl font-bold text-blue-800">
                        {averageProcedureDuration.toFixed(0)} minutos
                      </span>
                    </div>

                    {/* Gráficos */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  <Card>
    <CardHeader>
      <CardTitle>Cirurgias por Status</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={{}} className="min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={Object.entries(surgeriesByProcedure).map(([name, value]) => ({
              name,
              value
            }))}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {Object.entries(surgeriesByProcedure).map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="#4C51BF"
                  radius={4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <ChartLegend />
      </ChartContainer>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Cirurgias por Tipo de Procedimento</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={{}} className="min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={Object.entries(surgeriesByProcedure).map(([name, value]) => ({
              name,
              value
            }))}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {Object.entries(surgeriesByProcedure).map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="#4C51BF"
                  radius={4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <ChartLegend />
      </ChartContainer>
    </CardContent>
  </Card>
</div>

                    {/* Cirurgias Canceladas */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Ban className="h-5 w-5 text-red-600" />
                        Cirurgias Canceladas e Motivos
                      </h4>
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
                  </div>

                  {/* Estatísticas de Tempo */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Estatísticas de Tempo
                    </h3>

                    {/* Resumo das Médias de Tempo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

                    <Card className="mb-6">
  <CardHeader>
    <CardTitle>Médias de Tempo por Etapa (minutos)</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={{}} className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={timeStatsData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#7C3AED" radius={4} />
        </BarChart>
      </ResponsiveContainer>
      <ChartLegend />
    </ChartContainer>
  </CardContent>
</Card>

                    {/* Tabela Detalhada */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5 text-indigo-600" />
                        Tempos de Transição Detalhados
                      </h4>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="bg-gray-50 text-left text-sm font-medium text-gray-700">
                              <th className="px-4 py-2">Paciente</th>
                              <th className="px-4 py-2">Admissão → Cirurgia (min)</th>
                              <th className="px-4 py-2">Fim Cirurgia → Alta (min)</th>
                              <th className="px-4 py-2">Permanência SRPA (min)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pacientesData.slice(0, 5).map((p, index) => (
                              <tr key={index} className="border-t border-gray-200 hover:bg-gray-100">
                                <td className="px-4 py-2">{p.nome}</td>
                                <td className="px-4 py-2">
                                  {calculateDuration(
                                    "Paciente admitido na unidade",
                                    "Início da cirurgia",
                                    p.timeline,
                                  ) || "N/A"}
                                </td>
                                <td className="px-4 py-2">
                                  {calculateDuration("Fim da cirurgia", "Paciente recebeu alta", p.timeline) || "N/A"}
                                </td>
                                <td className="px-4 py-2">
                                  {calculateDuration(
                                    "Transferido para SRPA",
                                    "Saída da SRPA para Quarto",
                                    p.timeline,
                                  ) || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
