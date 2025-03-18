"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { summaryStats, clusterSizeDistribution, speciesDistribution, taxonomicGroups } from "@/lib/data"
import { SummaryCards } from "./summary-cards"
import { ClusterSizeChart } from "./cluster-size-chart"
import { SpeciesDistributionChart } from "./species-distribution-chart"
import { TaxonomicGroupChart } from "./taxonomic-group-chart"
import { RecentClusters } from "./recent-clusters"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import { ExportDialog } from "@/components/export-dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Dashboard refreshed",
        description: "Latest data has been loaded",
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader title="Dashboard" description="Overview of protein clustering analysis" />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : isMobile ? "Refresh" : "Refresh Data"}
        </Button>

        <ExportDialog
          data={{
            summaryStats,
            clusterSizeDistribution,
            speciesDistribution,
            taxonomicGroups,
          }}
          filename="kinfin-dashboard"
          trigger={
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {isMobile ? "Export" : "Export Dashboard"}
            </Button>
          }
        />
      </div>

      <SummaryCards stats={summaryStats} />

      <Tabs defaultValue="clusters" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex overflow-x-auto no-scrollbar">
          <TabsTrigger value="clusters" className="flex-1 sm:flex-none">
            Clusters
          </TabsTrigger>
          <TabsTrigger value="species" className="flex-1 sm:flex-none">
            Species
          </TabsTrigger>
          <TabsTrigger value="taxonomy" className="flex-1 sm:flex-none">
            Taxonomy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clusters" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full md:col-span-2">
              <CardHeader>
                <CardTitle>Cluster Size Distribution</CardTitle>
                <CardDescription>Number of clusters by size category</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[250px] sm:h-[350px]">
                  <ClusterSizeChart data={clusterSizeDistribution} />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Recent Clusters</CardTitle>
                <CardDescription>Recently analyzed clusters</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentClusters />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="species" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full md:col-span-2">
              <CardHeader>
                <CardTitle>Species Distribution</CardTitle>
                <CardDescription>Distribution of proteins across species</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[250px] sm:h-[350px]">
                  <SpeciesDistributionChart data={speciesDistribution} />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Top Species</CardTitle>
                <CardDescription>Species with most proteins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {speciesDistribution.slice(0, 5).map((species, index) => (
                    <div key={species.name} className="flex items-center">
                      <div className="w-8 text-muted-foreground">{index + 1}</div>
                      <div className="flex-1 font-medium">{species.name}</div>
                      <div className="text-muted-foreground">{species.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="taxonomy" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full md:col-span-2">
              <CardHeader>
                <CardTitle>Taxonomic Group Distribution</CardTitle>
                <CardDescription>Distribution of clusters across taxonomic groups</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[250px] sm:h-[350px]">
                  <TaxonomicGroupChart data={taxonomicGroups} />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Top Taxonomic Groups</CardTitle>
                <CardDescription>Groups with most clusters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxonomicGroups.map((group, index) => (
                    <div key={group.name} className="flex items-center">
                      <div className="w-8 text-muted-foreground">{index + 1}</div>
                      <div className="flex-1 font-medium">{group.name}</div>
                      <div className="text-muted-foreground">{group.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

