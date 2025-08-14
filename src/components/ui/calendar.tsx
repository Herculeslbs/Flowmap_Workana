"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Dica: em v9 o DayPicker já tem o prop `hideWeekdays`
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  // opcional: manter para ter um default
  hideWeekdays?: boolean
}

export function Calendar({
  className,
  hideWeekdays = false,
  showOutsideDays = true,
  locale = ptBR,
  classNames,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      hideWeekdays={hideWeekdays}   // <— oculta “dom seg …” quando true
      locale={locale}
      className={cn("p-3", className)}
      /* v9: nomes corretos de classes + grid para alinhar */
      classNames={{
        months: "relative flex flex-wrap justify-center gap-8",
        month: "space-y-4",
        month_caption: "flex items-center justify-center gap-2 pt-1 h-9 text-sm font-medium",
        nav: "absolute inset-x-0 flex items-center justify-between px-2",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        
        chevron: "inline-block h-4 w-4",
        /* estas 3 linhas garantem alinhamento */
        weekdays: "grid grid-cols-7",
        weekday: "h-9 w-9 flex items-center justify-center font-medium text-muted-foreground",
        week: "grid grid-cols-7",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        ...classNames,
      }}
      /* v9: ícone de navegação é `Chevron` */
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
