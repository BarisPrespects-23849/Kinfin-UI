"use client"

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "@/components/ui/card"

interface ComparisonBarChartProps {
  clusters: any[]
}

export function ComparisonBarChart({ clusters }: ComparisonBarChartProps) {
  // Transform data for the chart
  const chartData = [
    {
      name: "Size",
      ...clusters.reduce((acc, cluster) => {
        acc[cluster.id] = cluster.size
        return acc
      }, {}),
    },
    {
      name: "Species Count",
      ...clusters.reduce((acc, cluster) => {
        acc[cluster.id] = cluster.speciesCount
        return acc
      }, {}),
    },
    {
      name: "Conservation Score",
      ...clusters.reduce((acc, cluster) => {
        acc[cluster.id] = cluster.conservationScore
        return acc
      }, {}),
    },
  ]

  // Generate colors based on the number of clusters
  const colors = [
    "hsl(var(--primary))",
    "hsl(262.1 83.3% 57.8%)",
    "hsl(291.1 92.5% 58.0%)",
    "hsl(322.1 91.4% 52.5%)",
    "hsl(349.7 89.2% 60.2%)",
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
        <YAxis className="text-xs fill-muted-foreground" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-2 border shadow-sm bg-background">
                  <div className="text-sm font-medium">{label}</div>
                  {payload.map((entry, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      <span style={{ color: entry.color }}>{entry.name}: </span>
                      {entry.value}
                    </div>
                  ))}
                </Card>
              )
            }
            return null
          }}
        />
        <Legend />
        {clusters.map((cluster, index) => (
          <Bar key={cluster.id} dataKey={cluster.id} fill={colors[index % colors.length]} name={cluster.id} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

