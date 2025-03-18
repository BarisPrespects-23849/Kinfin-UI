"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { clusterSizeDistribution, taxonomicGroups, clusters } from "@/lib/data"
import { ExportDialog } from "@/components/export-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClusterSizeDistributionChart } from "./cluster-size-distribution-chart"
import { ClusterHeatmap } from "./cluster-heatmap"
import { ClusterScatterPlot } from "./cluster-scatter-plot"

export default function ClusterStatsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cluster Statistics"
        description="Advanced statistical analysis of protein clusters"
        breadcrumbs={[
          { name: "Clusters", href: "/clusters" },
          { name: "Statistics", href: "/clusters/stats", current: true },
        ]}
      />

      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/clusters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clusters
          </Link>
        </Button>

        <ExportDialog
          data={{
            clusterSizeDistribution,
            taxonomicGroups,
            clusterStats: {
              totalClusters: clusters.length,
              averageSize: Math.round(clusters.reduce((sum, c) => sum + c.size, 0) / clusters.length),
              averageSpeciesCount: Math.round(clusters.reduce((sum, c) => sum + c.speciesCount, 0) / clusters.length),
              averageConservationScore: Number.parseFloat(
                (clusters.reduce((sum, c) => sum + c.conservationScore, 0) / clusters.length).toFixed(2),
              ),
            },
          }}
          filename="cluster-statistics"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusters.length.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(clusters.reduce((sum, c) => sum + c.size, 0) / clusters.length).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">proteins per cluster</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Species</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(clusters.reduce((sum, c) => sum + c.speciesCount, 0) / clusters.length).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">species per cluster</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Conservation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number.parseFloat(
                (clusters.reduce((sum, c) => sum + c.conservationScore, 0) / clusters.length).toFixed(2),
              )}
            </div>
            <p className="text-xs text-muted-foreground">conservation score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Size Distribution</TabsTrigger>
          <TabsTrigger value="correlation">Correlations</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cluster Size Distribution</CardTitle>
              <CardDescription>Detailed distribution of cluster sizes</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ClusterSizeDistributionChart data={clusterSizeDistribution} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cluster Size vs. Species Count</CardTitle>
              <CardDescription>Correlation between cluster size and number of species</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ClusterScatterPlot />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cluster-Species Heatmap</CardTitle>
              <CardDescription>Heatmap showing cluster presence across species</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ClusterHeatmap />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

