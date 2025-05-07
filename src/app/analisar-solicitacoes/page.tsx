"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Search, Check, X, ClipboardList, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type SectionType = "agendamentos" | "inclusao-exclusao" | "outro" | null

export default function AnalisarSolicitacoes() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState<SectionType>(null)

  // Dados simulados para agendamentos
  const agendamentos = [
    { data: "10/05", procedimento: "COLECISTECTOMIA VIDEOLAPAROSCÓPICA", equipe: "DR. JOSÉ AUGUSTO" },
    { data: "10/05", procedimento: "HERNIORRAFIA INGUINAL", equipe: "DR. JOSÉ AUGUSTO" },
    { data: "10/05", procedimento: "CESARIANA", equipe: "DRA. JAQUELINE" },
    { data: "12/05", procedimento: "CESARIANA", equipe: "DRA. MARIANA" },
    { data: "12/05", procedimento: "URETROLITOTRISPSIA FLEXÍVEL", equipe: "DR. CARLOS" },
    { data: "13/05", procedimento: "LIPOASPIRAÇÃO DE ABDOME", equipe: "DR. MARCOS" },
    { data: "13/05", procedimento: "PROSTATECTOMIA RADICAL VIDEOLAPAROSCÓPICA", equipe: "DRA. JOYCE" },
    { data: "13/05", procedimento: "TRATAMENTO CIRÚRGICO DE ENDOMETRIOSE", equipe: "DR. RICARDO" },
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

  // Função para fazer logout
  const handleLogout = () => {
    router.push("/login")
  }

  // Função para aprovar ou rejeitar solicitação
  const handleSolicitacao = (index: number, aprovado: boolean) => {
    toast({
      title: aprovado ? "Solicitação aprovada" : "Solicitação rejeitada",
      description: `A solicitação de ${solicitacoesEquipe[index].tipo} foi ${aprovado ? "aprovada" : "rejeitada"}.`,
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

  // Função para visualizar mapa cirúrgico
  const handleVisualizarMapa = () => {
    router.push("/mapa-cirurgico")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <header className="w-full bg-[#1E40AF] py-3 px-4 flex justify-between items-center text-white shadow-md">
        <h1 className="text-lg md:text-xl font-medium">Análise de Solicitações</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base">Enfermeiro(a) Luciano</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-blue-700">
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:p-10">
        {/* Botões principais */}
        {!activeSection && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-6">Solicitações</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Button
                    className="w-full flex justify-start items-center py-4 px-6 bg-pink-400 hover:bg-pink-500 text-black font-bold rounded-md relative"
                    onClick={() => setActiveSection("agendamentos")}
                  >
                    <div className="flex items-center">
                      <div className="bg-pink-600 p-2 rounded-full mr-4">
                        <ClipboardList className="h-6 w-6 text-white" />
                      </div>
                      <span>Agendamento de procedimentos</span>
                    </div>
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      10
                    </span>
                  </Button>

                  <Button
                    className="w-full flex justify-start items-center py-4 px-6 bg-orange-400 hover:bg-orange-500 text-black font-bold rounded-md relative"
                    onClick={() => setActiveSection("inclusao-exclusao")}
                  >
                    <div className="flex items-center">
                      <div className="bg-orange-600 p-2 rounded-full mr-4">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <span>Inclusão/exclusão de membros</span>
                    </div>
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      7
                    </span>
                  </Button>

                  <div className="w-full py-4 px-6 bg-sky-400 rounded-md relative opacity-50">
                    <div className="flex items-center">
                      <div className="bg-sky-600 p-2 rounded-full mr-4">
                        <div className="h-6 w-6"></div>
                      </div>
                      <span className="font-bold text-black">Alteração de datas e horários</span>
                    </div>
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                      5
                    </span>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg bg-blue-900 text-white p-6 flex flex-col justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90">
                    <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%202025-05-07%20164054-mcCBofYJu15wSSMEsNnLqkO7aP9D2T.png')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                  </div>

                  <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                      FLO<span className="text-pink-400">W</span>MAP
                    </h1>
                    <p className="text-xl md:text-2xl font-light mb-4">
                      O futuro da gestão cirúrgica. Ao alcance dos seus olhos.
                    </p>
                    <p className="text-sm text-blue-100">
                      Transformando a experiência cirúrgica com tecnologia inteligente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seção de Agendamentos */}
        {activeSection === "agendamentos" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => setActiveSection(null)} className="mb-4">
                Voltar
              </Button>
              <div className="bg-pink-400 py-3 px-4 text-center text-black font-bold text-xl mb-6">AGENDAMENTOS</div>
            </div>

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
                      <SelectItem value="10-05">10/05</SelectItem>
                      <SelectItem value="12-05">12/05</SelectItem>
                      <SelectItem value="13-05">13/05</SelectItem>
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
                      <SelectItem value="jose">DR. JOSÉ AUGUSTO</SelectItem>
                      <SelectItem value="jaqueline">DRA. JAQUELINE</SelectItem>
                      <SelectItem value="mariana">DRA. MARIANA</SelectItem>
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
                      <SelectItem value="herniorrafia">HERNIORRAFIA</SelectItem>
                      <SelectItem value="cesariana">CESARIANA</SelectItem>
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
              <div className="grid grid-cols-12 bg-gray-100 font-bold text-center">
                <div className="col-span-2 p-3 border-r border-gray-300">DATA</div>
                <div className="col-span-6 p-3 border-r border-gray-300">PROCEDIMENTO</div>
                <div className="col-span-4 p-3">EQUIPE</div>
              </div>

              {agendamentos.map((agendamento, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 border-t border-gray-300 hover:bg-blue-50 cursor-pointer"
                  onClick={() => setActiveSection("outro")}
                >
                  <div className="col-span-2 p-3 border-r border-gray-300 text-center">{agendamento.data}</div>
                  <div className="col-span-6 p-3 border-r border-gray-300">{agendamento.procedimento}</div>
                  <div className="col-span-4 p-3 text-center">{agendamento.equipe}</div>
                </div>
              ))}
            </div>


          </div>
        )}

        {/* Seção de Pré-Agendamento (quando clica em um agendamento) */}
        {activeSection === "outro" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => setActiveSection("agendamentos")} className="mb-4">
                Voltar
              </Button>
              <div className="bg-pink-400 py-3 px-4 text-center text-black font-bold text-xl mb-6">AGENDAMENTOS</div>
            </div>

            <div className="border border-gray-300 rounded-md p-6 mb-6">
              <h2 className="text-xl font-bold text-center mb-6">PRÉ-AGENDAMENTO</h2>

              <div className="border border-gray-300 rounded-md p-6 mb-6">
                <h3 className="text-lg font-bold text-center mb-4">EQUIPE: {preAgendamento.equipe}</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="font-bold">
                      NOME: <span className="font-normal">{preAgendamento.nome}</span>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-2">
                    <p className="font-bold">DATA:</p>
                    <div className="flex-1">
                      <p className="font-normal">{preAgendamento.data}</p>
                      <div className="mt-2">
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
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div className="flex items-start gap-2">
                    <p className="font-bold">PROCEDIMENTO:</p>
                    <div className="flex-1">
                      <p className="font-normal">{preAgendamento.procedimento}</p>
                      <div className="mt-2">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-2">
                    <p className="font-bold">LATERALIDADE:</p>
                    <div className="flex-1">
                      <p className="font-normal">{preAgendamento.lateralidade}</p>
                      <div className="mt-2">
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

                  <div className="flex items-start gap-2">
                    <p className="font-bold">CONVÊNIO:</p>
                    <div className="flex-1">
                      <p className="font-normal">{preAgendamento.convenio}</p>
                      <div className="mt-2">
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Button
                    className="w-full py-6 bg-green-400 hover:bg-green-500 text-black font-bold text-lg rounded-md"
                    onClick={handleConfirmarAgendamento}
                  >
                    CONFIRMAR AGENDAMENTO
                  </Button>
            
                </div>

                <div className="relative">
                  <Button
                    className="w-full py-6 bg-green-400 hover:bg-green-500 text-black font-bold text-lg rounded-md"
                    onClick={handleEnviarPreAgendamento}
                  >
                    ENVIAR PRÉ-AGENDAMENTO
                  </Button>
                  
                </div>
              </div>

              <div className="mt-16 relative">
                <Button
                  className="w-full py-6 bg-pink-400 hover:bg-pink-500 text-black font-bold text-lg rounded-md"
                  onClick={handleVisualizarMapa}
                >
                  VISUALIZAR MAPA CIRÚRGICO DESTE DIA
                </Button>
        
              </div>
            </div>
          </div>
        )}

        {/* Seção de Inclusão/Exclusão de Membros */}
        {activeSection === "inclusao-exclusao" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => setActiveSection(null)} className="mb-4">
                Voltar
              </Button>
              <div className="bg-orange-400 py-3 px-4 text-center text-black font-bold text-xl mb-6">
                Inclusão/exclusão de membros de equipes
              </div>
            </div>

            {/* Tabela de Solicitações */}
            <div className="border border-gray-300 rounded-sm overflow-hidden">
              <table className="w-full">
                <tbody>
                  {solicitacoesEquipe.map((solicitacao, index) => (
                    <tr key={index} className="border-t border-gray-300">
                      <td className="p-4 border-r border-gray-300">
                        <p>
                          <strong>{solicitacao.nome}</strong> ({solicitacao.especialidade}){" "}
                          <strong>solicitou {solicitacao.tipo}</strong> na equipe {solicitacao.equipe} (
                          {solicitacao.especialidadeEquipe})
                        </p>
                      </td>
                      <td className="p-2 border-r border-gray-300 text-center" style={{ width: "60px" }}>
                        <Button
                          variant="ghost"
                          className="rounded-full p-2 hover:bg-red-100"
                          onClick={() => handleSolicitacao(index, false)}
                        >
                          <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                            <X className="h-6 w-6" />
                          </div>
                        </Button>
                      </td>
                      <td className="p-2 text-center" style={{ width: "60px" }}>
                        <Button
                          variant="ghost"
                          className="rounded-full p-2 hover:bg-green-100"
                          onClick={() => handleSolicitacao(index, true)}
                        >
                          <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                            <Check className="h-6 w-6" />
                          </div>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center text-gray-500">(...)</div>
          </div>
        )}
      </main>
    </div>
  )
}
