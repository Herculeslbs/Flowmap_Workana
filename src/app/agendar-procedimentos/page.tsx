"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Search,
  PlusCircle,
  ChevronDown,
  ArrowLeftCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import NotificationButton from "../notification-button/page";

// Tipos para os dados dos procedimentos
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
  | "Agendado"
  | "Solicitado";

type Lateralidade = "N/A" | "DIREITO" | "ESQUERDO" | "BILATERAL";

interface Procedimento {
  id: number;
  data: string; // formato ISO
  status: Status;
  sala?: number;
  horario?: string;
  paciente: string;
  idade: number;
  procedimento: string;
  lateralidade: Lateralidade;
  cirurgiao: string;
  convenio: string;
  especialidade: string;
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
  Agendado: "bg-green-500 text-white",
  Solicitado: "bg-yellow-500 text-white",
};

// Dados fictícios para os procedimentos
const procedimentos: Procedimento[] = [
  {
    id: 1,
    data: "2025-07-14",
    status: "Agendado",
    sala: 1,
    horario: "07:30",
    paciente: "José Carlos Otero",
    idade: 45,
    procedimento: "CVL",
    lateralidade: "N/A",
    cirurgiao: "DR. ANTONIO",
    convenio: "UNIMED",
    especialidade: "Cirurgia Geral",
  },
  {
    id: 2,
    data: "2025-07-14",
    status: "Agendado",
    sala: 1,
    horario: "10:00",
    paciente: "Luzia Marques",
    idade: 66,
    procedimento: "HERNIORRAFIA INGUINAL",
    lateralidade: "DIREITO",
    cirurgiao: "DRA. SUELEN",
    convenio: "BRADESCO",
    especialidade: "Cirurgia Geral",
  },
  {
    id: 3,
    data: "2025-07-14",
    status: "Solicitado",
    paciente: "Antônio Ferreira de Albuquerque",
    idade: 58,
    procedimento: "ARTROSCOPIA DE JOELHO",
    lateralidade: "ESQUERDO",
    cirurgiao: "DR. PAULO",
    convenio: "UNIMED",
    especialidade: "Ortopedia",
  },
  {
    id: 4,
    data: "2025-07-15",
    status: "Agendado",
    sala: 1,
    horario: "11:00",
    paciente: "Maria José da Silva",
    idade: 67,
    procedimento: "HISTERECTOMIA VAGINAL",
    lateralidade: "N/A",
    cirurgiao: "DRA. MÁRCIA",
    convenio: "GOLDEN",
    especialidade: "Obstetrícia",
  },
  {
    id: 5,
    data: "2025-07-15",
    status: "Agendado",
    sala: 1,
    horario: "13:00",
    paciente: "Maria José da Silva",
    idade: 67,
    procedimento: "HISTERECTOMIA VAGINAL",
    lateralidade: "N/A",
    cirurgiao: "DR. JOSÉ CARLOS",
    convenio: "FUSEX",
    especialidade: "Obstetrícia",
  },
  {
    id: 6,
    data: "2025-07-15",
    status: "Solicitado",
    paciente: "Fernanda Cristina Oliveira Santos",
    idade: 42,
    procedimento: "MAMOPLASTIA REDUTORA",
    lateralidade: "BILATERAL",
    cirurgiao: "DRA. CARLA",
    convenio: "BRADESCO",
    especialidade: "Cirurgia Plástica",
  },
  {
    id: 7,
    data: "2025-07-15",
    status: "Agendado",
    sala: 2,
    horario: "14:00",
    paciente: "Breno da Cunha Machado",
    idade: 28,
    procedimento: "HERNIORRAFIA INGUINAL",
    lateralidade: "DIREITO",
    cirurgiao: "DRA. MARISA",
    convenio: "BRADESCO",
    especialidade: "Cirurgia Geral",
  },
  {
    id: 8,
    data: "2025-07-15",
    status: "Agendado",
    sala: 4,
    horario: "08:30",
    paciente: "Justino Cardoso Lima",
    idade: 72,
    procedimento: "FACO",
    lateralidade: "DIREITO",
    cirurgiao: "DR. LUCIANO",
    convenio: "PARTICULAR",
    especialidade: "Oftalmologia",
  },
  {
    id: 9,
    data: "2025-07-15",
    status: "Solicitado",
    paciente: "Ricardo Mendes de Almeida Prado",
    idade: 35,
    procedimento: "SEPTOPLASTIA",
    lateralidade: "N/A",
    cirurgiao: "DR. FERNANDO",
    convenio: "AMIL",
    especialidade: "Otorrino",
  },
  {
    id: 10,
    data: "2025-07-15",
    status: "Agendado",
    sala: 3,
    horario: "10:30",
    paciente: "Emanuel de Jesus",
    idade: 55,
    procedimento: "URETEROLITOTOMIA FLEXÍVEL",
    lateralidade: "ESQUERDO",
    cirurgiao: "DRA. MÁRCIA",
    convenio: "UNIMED",
    especialidade: "Urologia",
  },
  {
    id: 11,
    data: "2025-07-15",
    status: "Agendado",
    sala: 4,
    horario: "08:30",
    paciente: "Justino Cardoso Lima",
    idade: 72,
    procedimento: "FACO",
    lateralidade: "DIREITO",
    cirurgiao: "DR. LUCIANO",
    convenio: "PARTICULAR",
    especialidade: "Oftalmologia",
  },
  {
    id: 12,
    data: "2025-07-15",
    status: "Agendado",
    sala: 3,
    horario: "07:30",
    paciente: "Antonio de Almeida Castro",
    idade: 78,
    procedimento: "POSTECTOMIA",
    lateralidade: "N/A",
    cirurgiao: "DR. LUCIANO",
    convenio: "AMIL",
    especialidade: "Urologia",
  },
  {
    id: 13,
    data: "2025-07-15",
    status: "Agendado",
    sala: 3,
    horario: "10:30",
    paciente: "Emanuel de Jesus",
    idade: 55,
    procedimento: "URETEROLITOTOMIA FLEXÍVEL",
    lateralidade: "ESQUERDO",
    cirurgiao: "DRA. MÁRCIA",
    convenio: "UNIMED",
    especialidade: "Urologia",
  },
];

// Lista de especialidades disponíveis
const especialidades = [
  "Cirurgia Geral",
  "Obstetrícia",
  "Ortopedia",
  "Oftalmologia",
  "Urologia",
  "Otorrino",
  "Cirurgia Plástica",
  "Neurologia",
  "Cardiologia",
];

// Lista de convênios disponíveis
const convenios = [
  "UNIMED",
  "BRADESCO",
  "SULAMÉRICA",
  "GOLDEN",
  "AMIL",
  "FUSEX",
  "PARTICULAR",
];

// Mapeamento de códigos de procedimentos para seus nomes
const procedimentosCodigos: Record<string, string> = {
  "31005128": "Colecistectomia sem colangiografia",
  "31009085": "Herniorrafia crural - unilateral",
  "31303218": "Histerectomia total laparoscópica",
};

// Lista de cirurgiões disponíveis
const cirurgioes = [
  "DR. ANTONIO",
  "DRA. SUELEN",
  "DR. RODRIGO",
  "DRA. MÁRCIA",
  "DR. JOSÉ CARLOS",
  "DRA. MARISA",
  "DR. LUCIANO",
  "DR. PAULO",
  "DRA. CARLA",
  "DR. FERNANDO",
];

export default function AgendarProcedimentos() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // Julho de 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [filtroAno, setFiltroAno] = useState("2025");
  const [filtroMes, setFiltroMes] = useState("7"); // Julho
  const [filtroDia, setFiltroDia] = useState("");
  const [procedimentosFiltrados, setProcedimentosFiltrados] = useState<
    Procedimento[]
  >([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [procedimentosLista, setProcedimentosLista] =
    useState<Procedimento[]>(procedimentos);
  const { toast } = useToast();

  // Estado para o novo procedimento
  const [novoProcedimento, setNovoProcedimento] = useState<{
    data: string;
    sala: string;
    horario: string;
    paciente: string;
    idade: string;
    codigoProcedimento: string;
    nomeProcedimento: string;
    lateralidade: Lateralidade;
    cirurgiao: string;
    convenio: string;
    especialidade: string;
    status: "Solicitado";
  }>({
    data: selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
    sala: "1",
    horario: "08:00",
    paciente: "",
    idade: "",
    codigoProcedimento: "",
    nomeProcedimento: "",
    lateralidade: "N/A",
    cirurgiao: "",
    convenio: "",
    especialidade: "",
    status: "Solicitado",
  });

  // Obter dias do mês atual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Obter anos disponíveis (2023-2026)
  const anos = ["2023", "2024", "2025", "2026"];

  // Obter meses disponíveis
  const meses = Array.from({ length: 12 }, (_, i) => ({
    valor: String(i + 1),
    nome: format(new Date(2025, i, 1), "MMMM", { locale: ptBR }),
  }));

  // Obter dias disponíveis (1-31)
  const dias = Array.from({ length: 31 }, (_, i) => String(i + 1));

  // Verificar se uma data tem procedimentos
  const temProcedimentos = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return procedimentosLista.some((proc) => proc.data === dateString);
  };

  // Contar procedimentos para uma data
  const contarProcedimentos = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return procedimentosLista.filter((proc) => proc.data === dateString).length;
  };

  // Obter especialidades únicas para uma data
  const obterEspecialidades = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const especialidades = procedimentosLista
      .filter((proc) => proc.data === dateString)
      .map((proc) => proc.especialidade);
    return Array.from(new Set(especialidades));
  };

  // Obter salas únicas para uma data
  const obterSalas = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const salas = procedimentosLista
      .filter((proc) => proc.data === dateString && proc.sala !== undefined)
      .map((proc) => proc.sala);
    return Array.from(new Set(salas)).length;
  };

  // Obter equipes únicas para uma data (baseado nos cirurgiões)
  const obterEquipes = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const cirurgioes = procedimentosLista
      .filter((proc) => proc.data === dateString)
      .map((proc) => proc.cirurgiao);
    return Array.from(new Set(cirurgioes)).length;
  };

  // Navegar para o mês anterior
  const mesAnterior = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Navegar para o próximo mês
  const proximoMes = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Selecionar uma data
  const selecionarData = (date: Date) => {
    setSelectedDate(date);
    setFiltroDia(format(date, "d"));
    setFiltroMes(String(date.getMonth() + 1));
    setFiltroAno(String(date.getFullYear()));

    // Atualizar a data do novo procedimento
    setNovoProcedimento({
      ...novoProcedimento,
      data: format(date, "yyyy-MM-dd"),
    });
  };

  // Aplicar filtros
  const aplicarFiltros = () => {
    let dataFiltro = "";

    if (filtroAno && filtroMes && filtroDia) {
      // Formatar a data com zero à esquerda para mês e dia
      const mes = filtroMes.padStart(2, "0");
      const dia = filtroDia.padStart(2, "0");
      dataFiltro = `${filtroAno}-${mes}-${dia}`;
    } else if (filtroAno && filtroMes) {
      const mes = filtroMes.padStart(2, "0");
      dataFiltro = `${filtroAno}-${mes}`;
    } else if (filtroAno) {
      dataFiltro = filtroAno;
    }

    if (dataFiltro) {
      const filtrados = procedimentosLista.filter((proc) =>
        proc.data.startsWith(dataFiltro)
      );
      setProcedimentosFiltrados(filtrados);

      // Se tiver dia específico, selecionar a data
      if (filtroAno && filtroMes && filtroDia) {
        const novaData = new Date(
          Number.parseInt(filtroAno),
          Number.parseInt(filtroMes) - 1,
          Number.parseInt(filtroDia)
        );
        setSelectedDate(novaData);
        setCurrentDate(
          new Date(
            Number.parseInt(filtroAno),
            Number.parseInt(filtroMes) - 1,
            1
          )
        );
      }
    } else {
      setProcedimentosFiltrados([]);
    }
  };

  // Limpar filtros
  const limparFiltros = () => {
    setFiltroAno("2025");
    setFiltroMes("7");
    setFiltroDia("");
    setSelectedDate(null);
    setProcedimentosFiltrados([]);
  };

  // Abrir modal de novo procedimento
  const abrirModalNovoProcedimento = () => {
    // Se tiver uma data selecionada, usar essa data para o novo procedimento
    if (selectedDate) {
      setNovoProcedimento({
        ...novoProcedimento,
        data: format(selectedDate, "yyyy-MM-dd"),
      });
    }
    setModalAberto(true);
  };

  // Fechar modal de novo procedimento
  const fecharModalNovoProcedimento = () => {
    setModalAberto(false);
  };

  // Atualizar campo do novo procedimento
  const atualizarCampoProcedimento = (campo: string, valor: string) => {
    setNovoProcedimento({
      ...novoProcedimento,
      [campo]: valor,
    });
  };

  // Atualizar código do procedimento e buscar o nome correspondente
  const atualizarCodigoProcedimento = (codigo: string) => {
    const nomeProcedimento = procedimentosCodigos[codigo] || "";
    setNovoProcedimento({
      ...novoProcedimento,
      codigoProcedimento: codigo,
      nomeProcedimento: nomeProcedimento,
    });
  };

  // Salvar novo procedimento
  const salvarNovoProcedimento = () => {
    // Validar campos obrigatórios
    if (
      !novoProcedimento.paciente ||
      !novoProcedimento.idade ||
      !novoProcedimento.codigoProcedimento ||
      !novoProcedimento.nomeProcedimento ||
      !novoProcedimento.cirurgiao ||
      !novoProcedimento.convenio ||
      !novoProcedimento.especialidade
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Criar novo procedimento
    const novoProcedimentoCompleto: Procedimento = {
      id: procedimentosLista.length + 1,
      data: novoProcedimento.data,
      status: "Solicitado",
      paciente: novoProcedimento.paciente,
      idade: Number.parseInt(novoProcedimento.idade),
      procedimento: novoProcedimento.nomeProcedimento,
      lateralidade: novoProcedimento.lateralidade,
      cirurgiao: novoProcedimento.cirurgiao,
      convenio: novoProcedimento.convenio,
      especialidade: novoProcedimento.especialidade,
    };

    // Adicionar à lista de procedimentos
    setProcedimentosLista([...procedimentosLista, novoProcedimentoCompleto]);

    // Se a data do novo procedimento corresponder à data selecionada, atualizar procedimentos filtrados
    if (
      selectedDate &&
      novoProcedimento.data === format(selectedDate, "yyyy-MM-dd")
    ) {
      setProcedimentosFiltrados([
        ...procedimentosFiltrados,
        novoProcedimentoCompleto,
      ]);
    }

    // Fechar modal
    fecharModalNovoProcedimento();

    // Mostrar toast de sucesso
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação foi enviada e está aguardando aprovação.",
    });
    // Resetar formulário
    setNovoProcedimento({
      data: selectedDate
        ? format(selectedDate, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      sala: "1",
      horario: "08:00",
      paciente: "",
      idade: "",
      codigoProcedimento: "",
      nomeProcedimento: "",
      lateralidade: "N/A",
      cirurgiao: "",
      convenio: "",
      especialidade: "",
      status: "Solicitado",
    });
  };

  // Efeito para aplicar filtros quando mudar a data selecionada
  useEffect(() => {
    if (selectedDate) {
      const dataString = format(selectedDate, "yyyy-MM-dd");
      const filtrados = procedimentosLista.filter(
        (proc) => proc.data === dataString
      );
      setProcedimentosFiltrados(filtrados);
    }
  }, [selectedDate, procedimentosLista]);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-white border-b pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Calendário Cirúrgico
            <NotificationButton />
          </CardTitle>
          <div className="flex items-center gap-2">
            <Link href="/mapa-cirurgico">
              <Button className="bg-blue-800 hover:bg-blue-700 text-white">
                <ArrowLeftCircle className="h-4 w-4" />
                Voltar Mapa Cirúrgico
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-blue-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm">
              <CardHeader className="bg-green-700 text-white p-4 flex flex-row justify-between items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={mesAnterior}
                  className="text-white hover:bg-green-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-bold text-center">
                  {format(currentDate, "yyyy MMMM", { locale: ptBR })}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={proximoMes}
                  className="text-white hover:bg-green-600"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-7 bg-green-600 text-white">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                    (day, index) => (
                      <div
                        key={index}
                        className="text-center py-2 text-sm font-medium"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 bg-white">
                  {monthDays.map((day, index) => {
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDate
                      ? isSameDay(day, selectedDate)
                      : false;
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const hasProcedures = temProcedimentos(day);

                    return (
                      <div
                        key={index}
                        className={`
                          relative h-14 border p-1 text-center 
                          ${!isCurrentMonth ? "text-gray-400" : ""}
                          ${isToday ? "bg-blue-50" : ""}
                          ${isSelected ? "bg-blue-100 font-bold" : ""}
                          ${
                            hasProcedures
                              ? "cursor-pointer hover:bg-gray-100"
                              : ""
                          }
                        `}
                        onClick={() => hasProcedures && selecionarData(day)}
                        onMouseEnter={() =>
                          hasProcedures && setHoveredDate(day)
                        }
                        onMouseLeave={() => setHoveredDate(null)}
                      >
                        <div className="text-sm">{format(day, "d")}</div>
                        {hasProcedures && (
                          <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                          </div>
                        )}

                        {/* Popover para mostrar resumo ao passar o mouse */}
                        {hoveredDate &&
                          isSameDay(day, hoveredDate) &&
                          hasProcedures && (
                            <Popover open={true}>
                              <PopoverTrigger asChild>
                                <div className="absolute inset-0 z-10"></div>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-80 bg-green-100 border-green-200 p-4"
                                side="right"
                              >
                                <div className="space-y-2">
                                  <div className="font-bold text-lg">
                                    {format(
                                      hoveredDate,
                                      "dd 'de' MMMM 'de' yyyy",
                                      { locale: ptBR }
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                      <span>
                                        {contarProcedimentos(hoveredDate)}{" "}
                                        procedimentos agendados
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                      <span>
                                        Especialidades:{" "}
                                        {obterEspecialidades(hoveredDate).join(
                                          ", "
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                      <span>
                                        {obterEquipes(hoveredDate)} equipes
                                        cirúrgicas
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                      <span>
                                        {obterSalas(hoveredDate)} salas
                                        cirúrgicas
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-600 mt-2">
                                    Clique para ver detalhes completos
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Detalhes */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm mb-6">
              <CardHeader className="bg-white border-b pb-4">
                <h2 className="text-xl font-bold">Filtrar por:</h2>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ano
                    </label>
                    <Select value={filtroAno} onValueChange={setFiltroAno}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {anos.map((ano) => (
                          <SelectItem key={ano} value={ano}>
                            {ano}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mês
                    </label>
                    <Select value={filtroMes} onValueChange={setFiltroMes}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {meses.map((mes) => (
                          <SelectItem key={mes.valor} value={mes.valor}>
                            {mes.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Dia
                    </label>
                    <Select value={filtroDia} onValueChange={setFiltroDia}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        {dias.map((dia) => (
                          <SelectItem key={dia} value={dia}>
                            {dia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="bg-blue-800 hover:bg-blue-700 text-white"
                    onClick={aplicarFiltros}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white"
                    onClick={limparFiltros}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Limpar filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Procedimentos filtrados */}
            <Card className="shadow-sm">
              <CardHeader className="bg-white border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold">
                  {selectedDate
                    ? `Procedimentos: ${format(selectedDate, "dd/MM/yyyy")}`
                    : "Procedimentos Agendados"}
                </h2>
                <Button
                  className="bg-blue-800 hover:bg-blue-700 text-white"
                  onClick={abrirModalNovoProcedimento}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Cadastrar Novo Procedimento
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {procedimentosFiltrados.length > 0 ? (
                  <div className="overflow-x-auto">
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
                          <th className="py-3 px-4 text-left whitespace-nowrap w-[300px]">
                            <div className="flex items-center gap-1">
                              <span>PACIENTE</span>
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
                              <span>CIRURGIÃO</span>
                              <ChevronDown size={16} />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {procedimentosFiltrados.map((proc) => (
                          <tr
                            key={proc.id}
                            className="bg-white hover:bg-gray-50 border-b"
                          >
                            <td className="py-3 px-4">
                              <Badge
                                className={`${
                                  statusColors[proc.status]
                                } font-normal`}
                              >
                                {proc.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {proc.status === "Solicitado" ? (
                                <span className="text-gray-500">-</span>
                              ) : (
                                proc.sala
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {proc.status === "Solicitado" ? (
                                <span className="text-gray-500">-</span>
                              ) : (
                                proc.horario
                              )}
                            </td>
                            <td className="py-3 px-4 w-[300px]">
                              {proc.paciente} ({proc.idade})
                            </td>
                            <td className="py-3 px-4 max-w-[200px] truncate">
                              {proc.procedimento}
                              {proc.lateralidade !== "N/A" &&
                                ` - ${proc.lateralidade}`}
                            </td>
                            <td className="py-3 px-4 max-w-[150px] truncate">
                              {proc.cirurgiao}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500 bg-white">
                    {selectedDate ? (
                      <p>Nenhum procedimento agendado para esta data.</p>
                    ) : (
                      <p>
                        Selecione uma data no calendário ou use os filtros para
                        buscar procedimentos.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>

      {/* Modal de Cadastro de Novo Procedimento */}
      <Dialog open={modalAberto} onOpenChange={fecharModalNovoProcedimento}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Solicitar Novo Procedimento
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={novoProcedimento.data}
                onChange={(e) =>
                  atualizarCampoProcedimento("data", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paciente">Nome do Paciente</Label>
              <Input
                id="paciente"
                placeholder="Nome completo"
                value={novoProcedimento.paciente}
                onChange={(e) =>
                  atualizarCampoProcedimento("paciente", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                type="number"
                placeholder="Idade"
                value={novoProcedimento.idade}
                onChange={(e) =>
                  atualizarCampoProcedimento("idade", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade</Label>
              <Select
                value={novoProcedimento.especialidade}
                onValueChange={(value) =>
                  atualizarCampoProcedimento("especialidade", value)
                }
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
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="codigoProcedimento">Código do Procedimento</Label>
              <Input
                id="codigoProcedimento"
                placeholder="Ex: 31005128"
                value={novoProcedimento.codigoProcedimento}
                onChange={(e) => atualizarCodigoProcedimento(e.target.value)}
              />
              {novoProcedimento.nomeProcedimento && (
                <div className="mt-1 text-sm bg-blue-50 p-2 rounded-md border border-blue-200">
                  <span className="font-semibold">Procedimento:</span>{" "}
                  {novoProcedimento.nomeProcedimento}
                </div>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Lateralidade</Label>
              <RadioGroup
                value={novoProcedimento.lateralidade}
                onValueChange={(value) =>
                  atualizarCampoProcedimento(
                    "lateralidade",
                    value as Lateralidade
                  )
                }
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="N/A" id="lateralidade-na" />
                  <Label htmlFor="lateralidade-na">N/A</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DIREITO" id="lateralidade-direito" />
                  <Label htmlFor="lateralidade-direito">DIREITO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ESQUERDO" id="lateralidade-esquerdo" />
                  <Label htmlFor="lateralidade-esquerdo">ESQUERDO</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cirurgiao">Cirurgião</Label>
              <Select
                value={novoProcedimento.cirurgiao}
                onValueChange={(value) =>
                  atualizarCampoProcedimento("cirurgiao", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cirurgião" />
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
              <Label htmlFor="convenio">Convênio</Label>
              <Select
                value={novoProcedimento.convenio}
                onValueChange={(value) =>
                  atualizarCampoProcedimento("convenio", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o convênio" />
                </SelectTrigger>
                <SelectContent>
                  {convenios.map((conv) => (
                    <SelectItem key={conv} value={conv}>
                      {conv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={fecharModalNovoProcedimento} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              className="bg-blue-800 hover:bg-blue-700 text-white w-full sm:w-auto"
              onClick={salvarNovoProcedimento}
            >
              Enviar Solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
