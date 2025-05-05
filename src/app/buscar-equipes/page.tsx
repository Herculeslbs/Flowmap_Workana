"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  Check,
  BellOff,
  UserPlus,
  UserMinus,
  RefreshCw,
} from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


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
const equipes: Equipe[] = [
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
    especialidade: "Cardiologia",
    cirurgiaoPrincipal: "Dr. Marcos Motta",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
  },
  {
    id: 3,
    especialidade: "Ortopedia",
    cirurgiaoPrincipal: "Dra. Ana Silva",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
  },
  {
    id: 4,
    especialidade: "Neurologia",
    cirurgiaoPrincipal: "Dr. Marcos Motta",
    membros: 4,
    procedimentosRealizados: 32,
    ehMembro: true,
  },
  {
    id: 5,
    especialidade: "Cardiologia",
    cirurgiaoPrincipal: "Dra. Ana Silva",
    membros: 5,
    procedimentosRealizados: 28,
    ehMembro: false,
  },
  {
    id: 6,
    especialidade: "Neurologia",
    cirurgiaoPrincipal: "Dr. Paulo Mendes",
    membros: 6,
    procedimentosRealizados: 15,
    ehMembro: false,
  },
  {
    id: 7,
    especialidade: "Oftalmologia",
    cirurgiaoPrincipal: "Dra. Carla Rodrigues",
    membros: 3,
    procedimentosRealizados: 42,
    ehMembro: false,
  },
  {
    id: 8,
    especialidade: "Urologia",
    cirurgiaoPrincipal: "Dr. Roberto Alves",
    membros: 5,
    procedimentosRealizados: 19,
    ehMembro: false,
  },
];
const solicitarCadastramento = () => {
  // Mostrar toast de sucesso
  toast({
    title: "Solicitação Enviada!",
    description: "Sua solicitação foi enviada com sucesso. Em breve você receberá a confirmação.",
  })}

export default function BuscarEquipes() {
  const [filtroEspecialidade, setFiltroEspecialidade] = useState<string>("");
  const [filtroCirurgiao, setFiltroCirurgiao] = useState<string>("");
  const [equipesExibidas, setEquipesExibidas] = useState<Equipe[]>(equipes);
  const [equipeDetalhada, setEquipeDetalhada] = useState<Equipe | null>(null);

  // Lista de especialidades únicas para o filtro
  const especialidades = Array.from(
    new Set(equipes.map((eq) => eq.especialidade))
  );

  // Lista de cirurgiões únicos para o filtro
  const cirurgioes = Array.from(
    new Set(equipes.map((eq) => eq.cirurgiaoPrincipal))
  );

  

  // Aplicar filtros
  useEffect(() => {
    let resultado = equipes;

    if (filtroEspecialidade) {
      resultado = resultado.filter(
        (eq) => eq.especialidade === filtroEspecialidade
      );
    }

    if (filtroCirurgiao) {
      resultado = resultado.filter(
        (eq) => eq.cirurgiaoPrincipal === filtroCirurgiao
      );
    }

    setEquipesExibidas(resultado);
  }, [filtroEspecialidade, filtroCirurgiao]);

  // Limpar filtros
  const limparFiltros = () => {
    setFiltroEspecialidade("");
    setFiltroCirurgiao("");
    setEquipesExibidas(equipes);
  };

  // Exibir detalhes da equipe
  const exibirDetalhes = (equipe: Equipe) => {
    setEquipeDetalhada(equipe);
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-3">
      <Card className="shadow-md">
        <CardHeader className="bg-white border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Buscar Equipes
            </CardTitle>
            <Link href="/equipes-cirurgicas">
              <Button
                className="bg-blue-800 hover:bg-blue-700 text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar Minhas Equipes
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Exibir por:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="col-span-1">
                <Select
                  value={filtroEspecialidade}
                  onValueChange={setFiltroEspecialidade}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Especialidade" />
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

              <div className="col-span-1">
                <Select
                  value={filtroCirurgiao}
                  onValueChange={setFiltroCirurgiao}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Cirurgião Principal" />
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

              <div className="flex items-center gap-2">
                <Button className="bg-blue-800 hover:bg-blue-700 text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>

                <Button
                  variant="outline"
                  className="bg-white"
                  onClick={limparFiltros}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Exibir todas
                </Button>
              </div>
            </div>

            {(filtroEspecialidade || filtroCirurgiao) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {filtroEspecialidade && (
                  <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                    Especialidade: {filtroEspecialidade}
                  </div>
                )}
                {filtroCirurgiao && (
                  <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                    Cirurgião: {filtroCirurgiao}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {equipesExibidas.length > 0 ? (
              equipesExibidas.map((equipe) => (
                <div
                  key={equipe.id}
                  className="rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => exibirDetalhes(equipe)}
                >
                  <div className="bg-white py-1 px-4 border-b">
                    <h3 className="text-center font-bold uppercase text-sm">
                      Descrição da Equipe
                    </h3>
                  </div>
                  <div className="bg-blue-100 p-4">
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
                        {equipe.ehMembro ? (
                          <div className="flex items-center text-xs">
                            <div className="bg-green-500 rounded-full p-1 mr-1">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                            <span>Você é membro desta equipe!</span>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs bg-white"
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Solicitar cadastramento
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-8 rounded-lg text-center">
                <p className="text-gray-500">
                  Nenhuma equipe encontrada com os filtros selecionados.
                </p>
                <Button variant="link" onClick={limparFiltros} className="mt-2">
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>

          {equipeDetalhada && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-center">
                Detalhes da Equipe
              </h2>

              <div className="bg-blue-100 p-6 rounded-lg mb-4">
                <div className="space-y-4">
                  <div className="text-lg">
                    <span className="font-bold">Especialidade:</span>{" "}
                    {equipeDetalhada.especialidade}
                  </div>
                  <div className="text-lg">
                    <span className="font-bold">Cirurgião principal:</span>{" "}
                    {equipeDetalhada.cirurgiaoPrincipal}
                  </div>
                  <div className="text-lg">
                    <span className="font-bold">Membros:</span>{" "}
                    {equipeDetalhada.membros.toString().padStart(2, "0")}
                  </div>
                  <div className="text-lg">
                    <span className="font-bold">Procedimentos realizados:</span>{" "}
                    {equipeDetalhada.procedimentosRealizados}
                  </div>
                  <div className="flex justify-end">
                    {equipeDetalhada.ehMembro && (
                      <div className="flex items-center">
                        <div className="bg-green-500 rounded-full p-1 mr-2">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">
                          Você é membro desta equipe!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {equipeDetalhada.ehMembro ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                    >
                      <UserMinus className="h-4 w-4" />
                      Solicitar desligamento
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                    >
                      <BellOff className="h-4 w-4" />
                      Silenciar notificações
                    </Button>
                  </>
                ) : (
                  <Button className="bg-blue-800 hover:bg-blue-700 text-white flex items-center justify-center gap-2 col-span-full md:col-span-1" onClick={solicitarCadastramento}>
                    <UserPlus className="h-4 w-4" />
                    Solicitar cadastramento
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Link href="/mapa-cirurgico">
              <Button className="bg-blue-800 hover:bg-blue-700 text-white">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Mapa Cirúrgico
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
