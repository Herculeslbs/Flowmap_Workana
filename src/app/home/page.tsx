"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Contato enviado com sucesso!",
      description: "Nossa equipe entrará em contato em breve.",
    });
    setFormData({ name: "", phone: "", email: "" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">
                FLO<span className="text-[#7c3aed]">W</span>MAP
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex md:gap-2">
              <a href="/login">
                <Button variant="outline">Sou Usuário</Button>
              </a>
              <a href="/login">
                <Button>Sou Operador</Button>
              </a>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="container border-t px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <div className="flex gap-2 pt-2">
                <a href="/login">
                  <Button variant="outline" size="sm" className="flex-1">
                    Sou Usuário
                  </Button>
                </a>
                <a href="/login">
                  <Button size="sm" className="flex-1">
                    Sou Operador
                  </Button>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 px-4 py-24 text-white md:py-32">
        <div className="absolute inset-0 z-0 opacity-20"></div>
        <div className="container relative z-10 mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
              FLO<span className="text-[#7c3aed]">W</span>MAP
            </h1>
            <p className="mb-2 text-xl font-medium md:text-2xl">
              O futuro da gestão cirúrgica. Ao alcance dos seus olhos.
            </p>
            <p className="mb-8 text-blue-100">
              Transformando a experiência cirúrgica com tecnologia inteligente.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full max-w-md overflow-hidden rounded-lg shadow-2xl md:h-[300px]">
              <img
                className="w-full h-full object-cover"
                src="https://i.ibb.co/hRJ4s26W/home.jpg"
                alt="home"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Migrate Section */}
      <section className="bg-white px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-lg md:p-10">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 md:text-3xl">
              Por que migrar para um sistema eletrônico de mapa cirúrgico?
            </h2>
            <div className="space-y-4 text-center">
              <p className="text-xl font-medium text-purple-600">
                Porque com o FloWMap, tudo flui melhor.
              </p>
              <p className="text-gray-700">
                Agendar, acompanhar e comunicar se torna simples, rápido e
                conectado.
              </p>
              <p className="text-gray-700">
                Com o calendário cirúrgico, as notificações em tempo real e a
                visualização clara de cada etapa, sua equipe ganha mais
                segurança, organização e tempo para focar no que realmente
                importa: o cuidado com o paciente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 md:text-4xl">
            Funcionalidades que transformam a gestão cirúrgica:
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Agendamento eletrônico, onde estiver"
              description="Médicos e membros da equipe podem solicitar cirurgias de forma totalmente digital, de qualquer dispositivo e lugar."
            />
            <FeatureCard
              title="Equipes integradas e notificadas"
              description="Cadastre-se em múltiplas equipes cirúrgicas e receba alertas em tempo real sobre o andamento dos casos dos seus pacientes."
            />
            <FeatureCard
              title="Calendário cirúrgico inteligente"
              description="Visualize a agenda completa do centro cirúrgico e escolha os melhores dias e horários para os seus procedimentos."
            />
            <FeatureCard
              title="Linha do tempo cirúrgica"
              description="Acompanhe cada etapa da jornada do paciente com atualizações instantâneas para toda a equipe envolvida."
            />
            <FeatureCard
              title="Mapa cirúrgico dinâmico"
              description="Veja o status de todas as cirurgias em tempo real, com um painel visual acessível em todo o centro cirúrgico."
            />
            <FeatureCard
              title="Quadro de cirurgia segura"
              description="Informações essenciais do paciente projetadas na sala operatória, garantindo segurança e alinhamento da equipe."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800 md:text-4xl">
            Quem Somos
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Somos uma equipe apaixonada por transformar a gestão cirúrgica no
              Brasil.
            </p>
            <p>
              O FloWMap nasceu da vivência prática dentro dos centros cirúrgicos
              e da necessidade urgente de otimizar processos, melhorar a
              comunicação entre equipes e aumentar a segurança dos pacientes.
            </p>
            <p>
              Unimos conhecimento clínico, expertise em tecnologia e visão de
              futuro para criar um sistema digital completo, que organiza o
              fluxo cirúrgico de ponta a ponta — do agendamento à recuperação do
              paciente.
            </p>
            <p>
              Acreditamos que a tecnologia deve ser simples, acessível e
              desenhada para resolver problemas reais. Por isso, o FloWMap foi
              criado com base nas dores e nos desafios vividos por quem está na
              linha de frente da assistência hospitalar.
            </p>
            <p>
              Nosso compromisso é com a eficiência, a segurança cirúrgica e a
              excelência em saúde. Mais do que um sistema, somos um parceiro
              estratégico na jornada de transformação digital da sua
              instituição.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gray-50 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800 md:text-4xl">
            Dúvidas Frequentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Como funciona o processo de aquisição do sistema FloWMap?
              </AccordionTrigger>
              <AccordionContent>
                A aquisição do FloWMap é realizada por meio de contratação
                direta com nossa equipe. Após o contato inicial, realizamos uma
                avaliação técnica do hospital ou clínica para identificar
                necessidades, elaborar um plano de implantação e apresentar a
                proposta personalizada, com módulos e funcionalidades ajustados
                à realidade da instituição.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                Quais tipos de instituições podem contratar o FloWMap?
              </AccordionTrigger>
              <AccordionContent>
                O sistema foi desenvolvido para atender desde grandes hospitais
                públicos e privados até clínicas cirúrgicas e centros de
                diagnóstico com procedimentos ambulatoriais. O único requisito é
                possuir rotinas cirúrgicas com necessidade de organização,
                rastreamento e comunicação entre equipes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                É necessário que o hospital adquira monitores para utilizar o
                FloWMap?
              </AccordionTrigger>
              <AccordionContent>
                <p>Não necessariamente. O FloWMap oferece dois caminhos:</p>
                <ul className="ml-6 mt-2 list-disc space-y-1">
                  <li>
                    Se a instituição já possui monitores (smart TVs ou telas
                    compatíveis), fazemos a integração com esses equipamentos.
                  </li>
                  <li>
                    Caso contrário, oferecemos um projeto completo de
                    instalação, fornecendo e configurando os monitores
                    necessários para o uso ideal do sistema, tanto nos
                    corredores quanto nas salas cirúrgicas.
                  </li>
                </ul>
                <p className="mt-2">
                  A instalação e o dimensionamento dos equipamentos são
                  gerenciados pela equipe técnica do FloWMap, após vistoria e
                  planejamento conjunto.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                O FloWMap oferece treinamento para as equipes?
              </AccordionTrigger>
              <AccordionContent>
                Sim. Todos os usuários envolvidos no processo (cirurgiões,
                anestesistas, enfermagem, administração) recebem treinamento
                prático e orientações personalizadas. Além disso, oferecemos
                materiais de apoio e suporte contínuo para garantir a adaptação
                plena da equipe ao sistema.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                Há suporte técnico após a implantação?
              </AccordionTrigger>
              <AccordionContent>
                Sim. O FloWMap conta com suporte técnico remoto e, quando
                necessário, presencial. Monitoramos a operação do sistema,
                realizamos atualizações periódicas e garantimos o pleno
                funcionamento da solução para evitar interrupções nos fluxos
                hospitalares.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="bg-white px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-lg md:p-10">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 md:text-3xl">
              Fale com um consultor
            </h2>
            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-md space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Telefone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-600"
              >
                Enviar
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 px-4 py-8">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                FLO<span className="text-purple-600">W</span>MAP
              </span>
            </div>
            <div className="text-center text-sm text-gray-500 md:text-right">
              &copy; {new Date().getFullYear()} FloWMap. Todos os direitos
              reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="flex flex-col p-6 transition-all hover:shadow-md">
      <h3 className="mb-2 text-lg font-semibold text-gray-800">✅ {title}:</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
}
