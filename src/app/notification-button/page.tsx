"use client"

import { useState } from "react"
import { Bell, Check, X, Calendar, UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Tipos para as notificações
type NotificationType = "success" | "error" | "info"

interface Notification {
  id: string
  type: NotificationType
  message: string
  date: string
  read: boolean
  icon: "user" | "calendar"
}

// Dados fictícios para as notificações
const notificationsData: Notification[] = [
  {
    id: "1",
    type: "success",
    message: "Sua solicitação de inclusão na equipe do Dr. Felipe Santos (ORTOPEDIA), foi aceita!",
    date: "Hoje, 10:45",
    read: false,
    icon: "user",
  },
  {
    id: "2",
    type: "error",
    message: "Sua solicitação de inclusão na equipe do Dr. João Fonseca (CARDIOLOGIA), foi negada!",
    date: "Hoje, 09:30",
    read: false,
    icon: "user",
  },
  {
    id: "3",
    type: "success",
    message:
      "Seu agendamento na sala 01 no dia 14/07/2025 as 10:30, para o procedimento 31005128 - Colecistectomia sem colangiografia, foi aceita!",
    date: "Ontem, 15:20",
    read: false,
    icon: "calendar",
  },
  {
    id: "4",
    type: "info",
    message: "O procedimento agendado para amanhã na sala 03 foi confirmado.",
    date: "Ontem, 14:15",
    read: true,
    icon: "calendar",
  },
  {
    id: "5",
    type: "success",
    message: "Sua solicitação de inclusão na equipe da Dra. Maria Silva (NEUROLOGIA), foi aceita!",
    date: "12/07/2025",
    read: true,
    icon: "user",
  },
  {
    id: "6",
    type: "info",
    message: "Novo protocolo de segurança para procedimentos cirúrgicos foi publicado.",
    date: "10/07/2025",
    read: true,
    icon: "calendar",
  },
]

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData)

  // Contar notificações não lidas
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Marcar todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  // Marcar uma notificação específica como lida
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    )
  }

  // Excluir uma notificação
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
        aria-label="Notificações"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Notificações</DialogTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-sm text-blue-600">
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 py-2">
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 rounded-lg relative",
                      notification.read ? "bg-gray-50" : "bg-blue-50 border-l-4 border-blue-500",
                    )}
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                          notification.type === "success" && "bg-green-100 text-green-600",
                          notification.type === "error" && "bg-red-100 text-red-600",
                          notification.type === "info" && "bg-blue-100 text-blue-600",
                        )}
                      >
                        {notification.icon === "user" ? (
                          notification.type === "success" ? (
                            <UserCheck className="h-5 w-5" />
                          ) : (
                            <UserX className="h-5 w-5" />
                          )
                        ) : (
                          <Calendar className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Marcar como lida</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>Nenhuma notificação disponível</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
