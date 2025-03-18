"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { clusterSizeDistribution, speciesDistribution, taxonomicGroups } from "@/lib/data"
import { ClusterSizeChart } from "@/components/dashboard/cluster-size-chart"
import { SpeciesDistributionChart } from "@/components/dashboard/species-distribution-chart"
import { TaxonomicGroupChart } from "@/components/dashboard/taxonomic-group-chart"
import { ClusterHeatmap } from "./cluster-heatmap"

export default function VisualizationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Visualizations</h1>
      </div>

      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="species">Species</TabsTrigger>
          <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cluster Size Distribution</CardTitle>
              <CardDescription>Number of clusters by size category</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ClusterSizeChart data={clusterSizeDistribution} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="species" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Species Distribution</CardTitle>
              <CardDescription>Distribution of proteins across species</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <SpeciesDistributionChart data={speciesDistribution} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxonomy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taxonomic Group Distribution</CardTitle>
              <CardDescription>Distribution of clusters across taxonomic groups</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <TaxonomicGroupChart data={taxonomicGroups} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cluster-Species Heatmap</CardTitle>
              <CardDescription>Heatmap showing cluster presence across species</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <ClusterHeatmap />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

