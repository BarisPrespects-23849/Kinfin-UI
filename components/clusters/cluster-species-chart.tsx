"use client"

import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"

interface ClusterSpeciesChartProps {
  data: {
    name: string
    value: number
  }[]
}

export function ClusterSpeciesChart({ data }: ClusterSpeciesChartProps) {
  // Generate colors based on primary color with different opacities
  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--primary) / 0.8)",
    "hsl(var(--primary) / 0.6)",
    "hsl(var(--primary) / 0.4)",
    "hsl(var(--primary) / 0.2)",
    "hsl(var(--muted))",
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsPieChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-2 border shadow-sm bg-background">
                  <div className="text-sm font-medium">{`${payload[0].name}`}</div>
                  <div className="text-sm text-muted-foreground">
                    {`Proteins: ${payload[0].value?.toLocaleString()}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {`Percentage: ${((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`}
                  </div>
                </Card>
              )
            }
            return null
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

