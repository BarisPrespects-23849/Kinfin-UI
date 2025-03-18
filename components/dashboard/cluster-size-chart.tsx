"use client"

import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"

interface ClusterSizeChartProps {
  data: {
    name: string
    value: number
  }[]
}

export function ClusterSizeChart({ data }: ClusterSizeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          className="text-xs fill-muted-foreground"
          label={{
            value: "Cluster Size",
            position: "insideBottom",
            offset: -5,
            className: "fill-muted-foreground text-xs",
          }}
        />
        <YAxis
          className="text-xs fill-muted-foreground"
          label={{
            value: "Number of Clusters",
            angle: -90,
            position: "insideLeft",
            className: "fill-muted-foreground text-xs",
          }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-2 border shadow-sm bg-background">
                  <div className="text-sm font-medium">{`Size: ${payload[0].payload.name}`}</div>
                  <div className="text-sm text-muted-foreground">{`Clusters: ${payload[0].value?.toLocaleString()}`}</div>
                </Card>
              )
            }
            return null
          }}
        />
        <Bar dataKey="value" fill="hsl(var(--primary))" />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

