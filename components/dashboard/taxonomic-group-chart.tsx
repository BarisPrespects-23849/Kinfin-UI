"use client"

import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"

interface TaxonomicGroupChartProps {
  data: {
    name: string
    value: number
  }[]
}

export function TaxonomicGroupChart({ data }: TaxonomicGroupChartProps) {
  // Generate colors based on primary color with different opacities
  const COLORS = [
    "hsl(221.2 83.2% 53.3%)",
    "hsl(262.1 83.3% 57.8%)",
    "hsl(291.1 92.5% 58.0%)",
    "hsl(322.1 91.4% 52.5%)",
    "hsl(349.7 89.2% 60.2%)",
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
                    {`Clusters: ${payload[0].value?.toLocaleString()}`}
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

