"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Info, Check, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Tipo para os dados de cada sala
interface DadosSala {
  sala: number;
  paciente: string;
  idade: number;
  procedimento: string;
  cirurgiao: string;
  auxiliar: string;
  anestesista: string;
  instrumentador: string;
  circulante: string;
  inicio: string;
  termino: string;
  convenio: string;
  alergia: string | null;
  jejum: "ADEQUADO" | "INADEQUADO";
  materiais: "COMPLETOS" | "INCOMPLETOS";
  timeline: {
    hora: string;
    status: string;
    concluido: boolean;
  }[];
}

// Dados fictícios para as salas
const dadosSalas: DadosSala[] = [
  {
    sala: 1,
    paciente: "Maria Aparecida da Silva",
    idade: 56,
    procedimento: "Ooforectomia Videolaparoscópica",
    cirurgiao: "Dr. Rafael Castro",
    auxiliar: "Dr. José Prado",
    anestesista: "Dr. Pedro Filgueiras",
    instrumentador: "Claudete",
    circulante: "Amanda",
    inicio: "09:00",
    termino: "01:10",
    convenio: "UNIMED",
    alergia: "DIPIRONA",
    jejum: "ADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "06:02", status: "Internação", concluido: true },
      { hora: "06:40", status: "APO", concluido: true },
      { hora: "07:15", status: "Chamado", concluido: true },
      { hora: "07:50", status: "Em procedimento", concluido: false },
      { hora: "09:30", status: "Finalização", concluido: false },
      { hora: "10:15", status: "Recuperação", concluido: false },
    ],
  },
  {
    sala: 2,
    paciente: "Maria Aparecida da Silva",
    idade: 66,
    procedimento: "Colecistectomia Videolaparoscópica",
    cirurgiao: "Dr. Rafael Costa",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dr. Pedro Figueira",
    instrumentador: "Claudete",
    circulante: "Amanda",
    inicio: "09:00",
    termino: "01:10",
    convenio: "BRADESCO",
    alergia: null,
    jejum: "ADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "06:15", status: "Internação", concluido: true },
      { hora: "06:45", status: "APO", concluido: true },
      { hora: "07:20", status: "Chamado", concluido: false },
      { hora: "08:00", status: "Em procedimento", concluido: false },
      { hora: "09:45", status: "Finalização", concluido: false },
      { hora: "10:30", status: "Recuperação", concluido: false },
    ],
  },
  {
    sala: 3,
    paciente: "Maria Aparecida da Silva",
    idade: 66,
    procedimento: "Colecistectomia Videolaparoscópica",
    cirurgiao: "Dr. Rafael Costa",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dr. Pedro Figueira",
    instrumentador: "Claudete",
    circulante: "Amanda",
    inicio: "09:00",
    termino: "01:10",
    convenio: "UNIMED",
    alergia: "PENICILINA",
    jejum: "ADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "06:30", status: "Internação", concluido: true },
      { hora: "07:00", status: "APO", concluido: false },
      { hora: "07:30", status: "Chamado", concluido: false },
      { hora: "08:15", status: "Em procedimento", concluido: false },
      { hora: "10:00", status: "Finalização", concluido: false },
      { hora: "10:45", status: "Recuperação", concluido: false },
    ],
  },
  {
    sala: 4,
    paciente: "Maria Aparecida da Silva",
    idade: 66,
    procedimento: "Colecistectomia Videolaparoscópica",
    cirurgiao: "Dr. Rafael Costa",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dr. Pedro Figueira",
    instrumentador: "Claudete",
    circulante: "Amanda",
    inicio: "09:00",
    termino: "01:10",
    convenio: "SULAMÉRICA",
    alergia: null,
    jejum: "ADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "06:45", status: "Internação", concluido: true },
      { hora: "07:15", status: "APO", concluido: false },
      { hora: "07:45", status: "Chamado", concluido: false },
      { hora: "08:30", status: "Em procedimento", concluido: false },
      { hora: "10:15", status: "Finalização", concluido: false },
      { hora: "11:00", status: "Recuperação", concluido: false },
    ],
  },
  {
    sala: 5,
    paciente: "Maria Aparecida da Silva",
    idade: 66,
    procedimento: "Colecistectomia Videolaparoscópica",
    cirurgiao: "Dr. Rafael Costa",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dr. Pedro Figueira",
    instrumentador: "Claudete",
    circulante: "Amanda",
    inicio: "09:00",
    termino: "01:10",
    convenio: "AMIL",
    alergia: "IBUPROFENO",
    jejum: "ADEQUADO",
    materiais: "INCOMPLETOS",
    timeline: [
      { hora: "07:00", status: "Internação", concluido: true },
      { hora: "07:30", status: "APO", concluido: false },
      { hora: "08:00", status: "Chamado", concluido: false },
      { hora: "08:45", status: "Em procedimento", concluido: false },
      { hora: "10:30", status: "Finalização", concluido: false },
      { hora: "11:15", status: "Recuperação", concluido: false },
    ],
  },
  {
    sala: 6,
    paciente: "Maria Aparecida da Silva",
    idade: 66,
    procedimento: "Colecistectomia Videolaparoscópica",
    cirurgiao: "Dr. Rafael Costa",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dr. Pedro Figueira",
    instrumentador: "Claudete",
    circulante: "Amanda",
    inicio: "09:00",
    termino: "01:10",
    convenio: "UNIMED",
    alergia: null,
    jejum: "INADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "07:15", status: "Internação", concluido: false },
      { hora: "07:45", status: "APO", concluido: false },
      { hora: "08:15", status: "Chamado", concluido: false },
      { hora: "09:00", status: "Em procedimento", concluido: false },
      { hora: "10:45", status: "Finalização", concluido: false },
      { hora: "11:30", status: "Recuperação", concluido: false },
    ],
  },
  {
    sala: 7,
    paciente: "Maria Aparecida da Silva",
    idade: 66,
    procedimento: "Colecistectomia Videolaparoscópica",
    cirurgiao: "Dr. Rafael Costa",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dr. Pedro Figueira",
    instrumentador: "Claudete",
    circulante: "Amanda",
    inicio: "09:00",
    termino: "01:10",
    convenio: "BRADESCO",
    alergia: "DIPIRONA",
    jejum: "ADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "07:30", status: "Internação", concluido: false },
      { hora: "08:00", status: "APO", concluido: false },
      { hora: "08:30", status: "Chamado", concluido: false },
      { hora: "09:15", status: "Em procedimento", concluido: false },
      { hora: "11:00", status: "Finalização", concluido: false },
      { hora: "11:45", status: "Recuperação", concluido: false },
    ],
  },
  {
    sala: 8,
    paciente: "Maria Aparecida da Silva",
    idade: 66,
    procedimento: "Colecistectomia Videolaparoscópica",
    cirurgiao: "Dr. Rafael Costa",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dr. Pedro Figueira",
    instrumentador: "Claudete",
    circulante: "Amanda",
    inicio: "09:00",
    termino: "01:10",
    convenio: "UNIMED",
    alergia: null,
    jejum: "ADEQUADO",
    materiais: "COMPLETOS",
    timeline: [
      { hora: "07:45", status: "Internação", concluido: false },
      { hora: "08:15", status: "APO", concluido: false },
      { hora: "08:45", status: "Chamado", concluido: false },
      { hora: "09:30", status: "Em procedimento", concluido: false },
      { hora: "11:15", status: "Finalização", concluido: false },
      { hora: "12:00", status: "Recuperação", concluido: false },
    ],
  },
  {
    sala: 9,
    paciente: "Maria Aparecida da Silva",
    idade: 66,
    procedimento: "Colecistectomia Videolaparoscópica",
    cirurgiao: "Dr. Rafael Costa",
    auxiliar: "Dr. José Paulo",
    anestesista: "Dr. Pedro Figueira",
    instrumentador: "Claudete",
    circulante: "Amanda",
    inicio: "09:00",
    termino: "01:10",
    convenio: "GOLDEN",
    alergia: "SULFAS",
    jejum: "ADEQUADO",
    materiais: "INCOMPLETOS",
    timeline: [
      { hora: "08:00", status: "Internação", concluido: false },
      { hora: "08:30", status: "APO", concluido: false },
      { hora: "09:00", status: "Chamado", concluido: false },
      { hora: "09:45", status: "Em procedimento", concluido: false },
      { hora: "11:30", status: "Finalização", concluido: false },
      { hora: "12:15", status: "Recuperação", concluido: false },
    ],
  },
];

export default function MapaPorSala() {
  const [salaAberta, setSalaAberta] = useState<number | null>(null);

  const abrirDetalhesSala = (sala: number) => {
    setSalaAberta(sala);
  };

  const fecharDetalhesSala = () => {
    setSalaAberta(null);
  };

  const dadosSalaAtual = dadosSalas.find((sala) => sala.sala === salaAberta);

  return (
    <div className="w-full h-full flex justify-center items-center p-3">
      <Card className="shadow-md">
        <CardHeader className="bg-white border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl font-bold">
              Mapa Cirúrgico Visualização Por Sala
            </CardTitle>
            <Link href="/mapa-cirurgico">
              <Button className="bg-blue-800 hover:bg-blue-700 text-white">
                <ArrowLeft className="h-4 w-4" />
                Voltar Mapa Cirúrgico
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-whit">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dadosSalas.map((sala) => (
              <div
                key={sala.sala}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => abrirDetalhesSala(sala.sala)}
              >
                <div className="border-b bg-gray-50 py-2 px-4">
                  <h2 className="text-center font-bold">
                    SALA {String(sala.sala).padStart(2, "0")}
                  </h2>
                </div>

                <div className="p-4 bg-blue-50">
                  <div className="mb-3">
                    <div className="font-semibold text-center">
                      {sala.paciente}{" "}
                      <span className="text-sm">{sala.idade}</span>
                    </div>
                    <div className="text-sm text-center font-medium flex items-center justify-center">
                      {sala.procedimento}
                      <Info className="ml-1 h-4 w-4 text-blue-600" />
                    </div>
                  </div>

                  <div className="text-xs space-y-1 mb-3">
                    <div>
                      <span className="font-semibold">Cirurgião:</span>{" "}
                      {sala.cirurgiao}
                    </div>
                    <div>
                      <span className="font-semibold">Auxiliar:</span>{" "}
                      {sala.auxiliar}
                    </div>
                    <div>
                      <span className="font-semibold">Anestesista:</span>{" "}
                      {sala.anestesista}
                    </div>
                    <div>
                      <span className="font-semibold">Instrumentador:</span>{" "}
                      {sala.instrumentador}
                    </div>
                    <div>
                      <span className="font-semibold">Circulante:</span>{" "}
                      {sala.circulante}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center">
                      <span className="font-semibold mr-1">INÍCIO:</span>{" "}
                      {sala.inicio}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> {sala.termino}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        {/* Modal de detalhes */}
        <Dialog open={salaAberta !== null} onOpenChange={fecharDetalhesSala}>
          <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 mr-2" />
                  <span className="text-xl font-bold">
                    {dadosSalaAtual?.termino}
                  </span>
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
                  {dadosSalaAtual?.paciente}{" "}
                  <span className="text-xl">{dadosSalaAtual?.idade}</span>
                </h1>

                <div className="bg-blue-200 inline-block px-4 py-1 rounded-md mt-2">
                  <span className="font-medium">
                    {dadosSalaAtual?.procedimento}
                  </span>
                  <span className="ml-2 bg-purple-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center">
                    E
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-between text-sm mb-6">
                <div>
                  <span className="font-semibold">Cirurgião:</span>{" "}
                  {dadosSalaAtual?.cirurgiao}
                </div>
                <div>
                  <span className="font-semibold">Auxiliar:</span>{" "}
                  {dadosSalaAtual?.auxiliar}
                </div>
                <div>
                  <span className="font-semibold">Anestesista:</span>{" "}
                  {dadosSalaAtual?.anestesista}
                </div>
                <div>
                  <span className="font-semibold">Circulante:</span>{" "}
                  {dadosSalaAtual?.circulante}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div
                  className={`p-4 rounded-md text-center ${
                    dadosSalaAtual?.alergia ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  <div className="text-red-500 font-semibold">ALERGIA</div>
                  <div className="mt-2">
                    {dadosSalaAtual?.alergia ? (
                      <div className="flex flex-col items-center">
                        <div className="bg-red-500 text-white rounded-md p-2 mb-2">
                          <Check className="h-6 w-6" />
                        </div>
                        <span className="font-bold">
                          {dadosSalaAtual.alergia}
                        </span>
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
                    dadosSalaAtual?.jejum === "ADEQUADO"
                      ? "bg-blue-100"
                      : "bg-red-100"
                  }`}
                >
                  <div className="text-blue-500 font-semibold">JEJUM</div>
                  <div className="mt-2">
                    <div className="flex flex-col items-center">
                      <div
                        className={`${
                          dadosSalaAtual?.jejum === "ADEQUADO"
                            ? "bg-blue-500"
                            : "bg-red-500"
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
                    dadosSalaAtual?.materiais === "COMPLETOS"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <div className="text-green-500 font-semibold">MATERIAIS</div>
                  <div className="mt-2">
                    <div className="flex flex-col items-center">
                      <div
                        className={`${
                          dadosSalaAtual?.materiais === "COMPLETOS"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } text-white rounded-md p-2 mb-2`}
                      >
                        <Check className="h-6 w-6" />
                      </div>
                      <span className="font-bold">
                        {dadosSalaAtual?.materiais}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <div className="flex justify-between mb-2">
                    {dadosSalaAtual?.timeline.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs font-medium">{item.hora}</div>
                      </div>
                    ))}
                  </div>

                  <div className="h-1 bg-gray-300 relative">
                    {dadosSalaAtual?.timeline.map((item, index, arr) => {
                      const percentagem = (index / (arr.length - 1)) * 100;
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
                          {item.concluido && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between mt-2">
                    {dadosSalaAtual?.timeline.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs">{item.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-200 px-4 py-1 rounded-md">
                  <span className="font-medium">
                    Convênio: {dadosSalaAtual?.convenio}
                  </span>
                </div>
              </div>
            </div>

            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
