"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipoUsuario = searchParams.get("tipo") || "usuario"

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Simulando um login
    setTimeout(() => {
      setIsLoading(false)
      console.log(values)

      // Redirecionar com base no tipo de usuário
      if (tipoUsuario === "operador") {
        router.push("/tela-operador")
      } else {
        router.push("/mapa-cirurgico")
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo - Imagem de fundo e logo */}
      <div className="relative w-full md:w-1/2 bg-[#0a3a5c] flex items-center justify-center p-6 md:p-12">
        <div className="absolute inset-0 bg-[#1E41A6] opacity-90">
          <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          {mounted && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <Logo />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-white text-xl md:text-2xl font-light mb-6"
              >
                O futuro da gestão cirúrgica. Ao alcance dos seus olhos.
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="hidden md:block">
                  <a href="/">
                    <Button className="bg-white hover:bg-blue-700 text-#7C3AED px-12 py-6 rounded-full text-lg">
                      Saiba mais
                    </Button>
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Lado direito - Formulário de login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          {mounted && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#0a3a5c] mb-2">
                  {tipoUsuario === "operador" ? "Acesso de Operador" : "Bem-vindo ao FLOWMAP"}
                </h1>
                <p className="text-gray-500">Faça login para acessar o sistema</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0a3a5c]">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="seu@email.com"
                              {...field}
                              className="py-6 border-gray-300 focus:border-[#7c3aed] focus:ring-[#7c3aed]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0a3a5c]">Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="******"
                              {...field}
                              className="py-6 border-gray-300 focus:border-[#7c3aed] focus:ring-[#7c3aed]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="pt-2"
                  >
                    <Button
                      type="submit"
                      className="w-full bg-[#1E41A6] opacity-90 hover:bg-blue-500 text-white font-medium py-6 rounded-full text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : tipoUsuario === "operador" ? (
                        "ENTRAR COMO OPERADOR"
                      ) : (
                        "ENTRAR"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <div className="inline-block">
      <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
        FLO<span className="text-[#7c3aed]">W</span>MAP
      </h1>
    </div>
  )
}
