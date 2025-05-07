"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Settings, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Tipo para os dados de cada equipe
interface Equipe {
  id: number;
  especialidade: string;
  cirurgiaoPrincipal: string;
  membros: number;
  procedimentosRealizados: number;
  ehMembro: boolean;
}

// Dados fictícios para as equipes
const equipesIniciais: Equipe[] = [
  {
    id: 1,
    especialidade: "Ortopedia",
    cirurgiaoPrincipal: "Dr. Marcos Motta",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
  },
  {
    id: 2,
    especialidade: "Ortopedia",
    cirurgiaoPrincipal: "Dr. Marcos Motta",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
  },
  {
    id: 3,
    especialidade: "Ortopedia",
    cirurgiaoPrincipal: "Dr. Marcos Motta",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
  },
  {
    id: 4,
    especialidade: "Ortopedia",
    cirurgiaoPrincipal: "Dr. Marcos Motta",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
  },
];

// Lista de especialidades disponíveis
const especialidades = [
  "Ortopedia",
  "Cardiologia",
  "Neurologia",
  "Cirurgia Geral",
  "Oftalmologia",
  "Urologia",
  "Otorrino",
  "Cirurgia Plástica",
  "Obstetrícia",
];

// Lista de cirurgiões disponíveis
const cirurgioes = [
  "Dr. Marcos Motta",
  "Dra. Ana Silva",
  "Dr. Paulo Mendes",
  "Dra. Carla Rodrigues",
  "Dr. Roberto Alves",
  "Dr. José Carlos",
  "Dra. Márcia Santos",
  "Dr. Antônio Oliveira",
  "Dra. Suelen Pereira",
];
export default function EquipesCirurgicas() {
  const [equipes, setEquipes] = useState<Equipe[]>(equipesIniciais)
  const [modalAberto, setModalAberto] = useState(false)
  const { toast } = useToast()

  // Estado para a nova equipe
  const [novaEquipe, setNovaEquipe] = useState<{
    especialidade: string
    cirurgiaoPrincipal: string
    membros: string
    procedimentosRealizados: string
  }>({
    especialidade: "",
    cirurgiaoPrincipal: "",
    membros: "",
    procedimentosRealizados: "",
  })

  // Abrir modal de nova equipe
  const abrirModalNovaEquipe = () => {
    setModalAberto(true)
  }

  // Fechar modal de nova equipe
  const fecharModalNovaEquipe = () => {
    setModalAberto(false)
  }

  // Atualizar campo da nova equipe
  const atualizarCampoEquipe = (campo: string, valor: string) => {
    setNovaEquipe({
      ...novaEquipe,
      [campo]: valor,
    })
  }

  // Salvar nova equipe
  const salvarNovaEquipe = () => {
    // Validar campos obrigatórios
    if (!novaEquipe.especialidade || !novaEquipe.cirurgiaoPrincipal || !novaEquipe.membros) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    // Criar nova equipe
    const novaEquipeCompleta: Equipe = {
      id: equipes.length + 1,
      especialidade: novaEquipe.especialidade,
      cirurgiaoPrincipal: novaEquipe.cirurgiaoPrincipal,
      membros: Number.parseInt(novaEquipe.membros),
      procedimentosRealizados: novaEquipe.procedimentosRealizados
        ? Number.parseInt(novaEquipe.procedimentosRealizados)
        : 0,
      ehMembro: true, // Por padrão, o usuário é membro da equipe que ele cria
    }

    // Adicionar à lista de equipes
    setEquipes([...equipes, novaEquipeCompleta])

    // Fechar modal
    fecharModalNovaEquipe()

    // Mostrar toast de sucesso
    toast({
      title: "Equipe criada",
      description: "A nova equipe foi criada com sucesso e você foi adicionado como membro.",
    })

    // Resetar formulário
    setNovaEquipe({
      especialidade: "",
      cirurgiaoPrincipal: "",
      membros: "",
      procedimentosRealizados: "",
    })
  }
  return (
    <div className="w-full h-full flex justify-center items-center p-3">
      <Card className="shadow-md">
        <CardHeader className="bg-white border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl font-bold">Minhas Equipes</CardTitle>
            <Link href="/mapa-cirurgico">
              <Button className="bg-blue-800 hover:bg-blue-700 text-white">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Mapa Cirúrgico
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {equipes
              .filter((equipe) => equipe.ehMembro)
              .map((equipe) => (
                <div
                  key={equipe.id}
                  className="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                >
                  <div className="bg-white py-1 px-4 border-b">
                    <h3 className="text-center font-bold uppercase text-sm">
                      Descrição da Equipe
                    </h3>
                  </div>
                  <div className=" bg-blue-50 p-4">
                    <div className="space-y-2">
                      <div>
                        <span className="font-bold">Especialidade:</span>{" "}
                        {equipe.especialidade}
                      </div>
                      <div>
                        <span className="font-bold">Cirurgião principal:</span>{" "}
                        {equipe.cirurgiaoPrincipal}
                      </div>
                      <div>
                        <span className="font-bold">Membros:</span>{" "}
                        {equipe.membros.toString().padStart(2, "0")}
                      </div>
                      <div>
                        <span className="font-bold">
                          Procedimentos realizados:
                        </span>{" "}
                        {equipe.procedimentosRealizados}
                      </div>
                      <div className="flex justify-end">
                        <div className="flex items-center text-xs">
                          <div className="bg-green-500 rounded-full p-1 mr-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span>Você é membro desta equipe!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
            <Link href="/buscar-equipes">
              <Button className="bg-blue-800 hover:bg-blue-700 text-white shadow-md">
                <Search className="h-4 w-4 mr-2" />
                <span>Buscar Equipes</span>
              </Button>
            </Link>

            <Button className="bg-blue-800 hover:bg-blue-700 text-white shadow-md">
              <Settings className="h-4 w-4 mr-2" />
              <span>Gerenciar Equipes</span>
            </Button>

            <Button className="bg-blue-800 hover:bg-blue-700 text-white shadow-md" onClick={abrirModalNovaEquipe}>
              <Plus className="h-4 w-4 mr-2" />
              <span>Nova Equipe</span>
            </Button>
          </div>
        </CardContent>
        {/* Modal de Cadastro de Nova Equipe */}
      <Dialog open={modalAberto} onOpenChange={fecharModalNovaEquipe}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Cadastrar Nova Equipe</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade</Label>
              <Select
                value={novaEquipe.especialidade}
                onValueChange={(value) => atualizarCampoEquipe("especialidade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp} value={esp}>
                      {esp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cirurgiaoPrincipal">Cirurgião Principal</Label>
              <Select
                value={novaEquipe.cirurgiaoPrincipal}
                onValueChange={(value) => atualizarCampoEquipe("cirurgiaoPrincipal", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cirurgião principal" />
                </SelectTrigger>
                <SelectContent>
                  {cirurgioes.map((cir) => (
                    <SelectItem key={cir} value={cir}>
                      {cir}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="membros">Número de Membros</Label>
              <Input
                id="membros"
                type="number"
                min="1"
                max="20"
                placeholder="Quantidade de membros"
                value={novaEquipe.membros}
                onChange={(e) => atualizarCampoEquipe("membros", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedimentosRealizados">Procedimentos Realizados</Label>
              <Input
                id="procedimentosRealizados"
                type="number"
                min="0"
                placeholder="Quantidade de procedimentos (opcional)"
                value={novaEquipe.procedimentosRealizados}
                onChange={(e) => atualizarCampoEquipe("procedimentosRealizados", e.target.value)}
              />
              <p className="text-xs text-gray-500">Deixe em branco para iniciar com zero procedimentos</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={fecharModalNovaEquipe}>
              Cancelar
            </Button>
            <Button className="bg-blue-800 hover:bg-blue-700 text-white" onClick={salvarNovaEquipe}>
              Confirmar Cadastro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </Card>
    </div>
  );
}
