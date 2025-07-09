"use client"

import { ResponsiveContainer } from "recharts"
import { ReactNode, ReactElement, isValidElement } from "react"
import clsx from "clsx"

type ChartContainerProps = {
  children?: ReactNode
  className?: string
  config?: Record<string, any>
}

export function ChartContainer({ children, className }: ChartContainerProps) {
  let chartElement: ReactElement | null = null
  const extraElements: ReactNode[] = []

  if (Array.isArray(children)) {
    children.forEach(child => {
      if (isValidElement(child) && !chartElement) {
        chartElement = child
      } else {
        extraElements.push(child)
      }
    })
  } else if (isValidElement(children)) {
    chartElement = children
  }

  return (
    <div className={clsx("relative h-[300px] w-full", className)}>
      {chartElement && (
        <ResponsiveContainer width="100%" height="100%">
          {chartElement}
        </ResponsiveContainer>
      )}
      {extraElements.length > 0 && (
        <div className="mt-2">
          {extraElements}
        </div>
      )}
    </div>
  )
}

export function ChartLegend() {
  return (
    <div className="text-sm text-muted-foreground mt-2 text-center">
      <p>Legenda do gráfico</p>
    </div>
  )
}