"use client"

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "@/components/ui/card"

interface ClusterSizeDistributionChartProps {
  data: {
    name: string
    value: number
  }[]
}

export function ClusterSizeDistributionChart({ data }: ClusterSizeDistributionChartProps) {
  // Transform data for the area chart
  const chartData = data.map((item) => ({
    size: item.name,
    count: item.value,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="size"
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
                  <div className="text-sm font-medium">{`Size: ${payload[0].payload.size}`}</div>
                  <div className="text-sm text-muted-foreground">{`Clusters: ${payload[0].value?.toLocaleString()}`}</div>
                </Card>
              )
            }
            return null
          }}
        />
        <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

