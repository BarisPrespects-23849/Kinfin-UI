"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Dna, Layers, Network, Sigma, Users } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface SummaryCardsProps {
  stats: {
    totalClusters: number
    totalProteins: number
    totalSpecies: number
    averageClusterSize: number
    singletonClusters: number
    multiSpeciesClusters: number
  }
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const isMobile = useMobile()

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Clusters</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.totalClusters.toLocaleString()}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {stats.singletonClusters.toLocaleString()} singletons
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Proteins</CardTitle>
          <Dna className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.totalProteins.toLocaleString()}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Avg. {stats.averageClusterSize} per cluster</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Species</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.totalSpecies.toLocaleString()}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Across all clusters</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            {isMobile ? "Multi-Species" : "Multi-Species Clusters"}
          </CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.multiSpeciesClusters.toLocaleString()}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {Math.round((stats.multiSpeciesClusters / stats.totalClusters) * 100)}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            {isMobile ? "Avg. Size" : "Average Cluster Size"}
          </CardTitle>
          <Sigma className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.averageClusterSize.toLocaleString()}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Proteins per cluster</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Taxonomic Groups</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">5</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Major taxonomic categories</p>
        </CardContent>
      </Card>
    </div>
  )
}

