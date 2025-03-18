"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { clusterDetail } from "@/lib/data"
import { ExportDialog } from "@/components/export-dialog"
import { ComparisonVennDiagram } from "./comparison-venn-diagram"
import { ComparisonTable } from "./comparison-table"
import { ComparisonBarChart } from "./comparison-bar-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface ClusterComparisonPageProps {
  clusterIds: string[]
}

// Mock function to get cluster data
const getClusterData = (id: string) => {
  // In a real app, this would fetch data from the API
  return {
    ...clusterDetail,
    id,
    size: Math.floor(Math.random() * 300) + 50,
    speciesCount: Math.floor(Math.random() * 20) + 5,
    conservationScore: Number.parseFloat((Math.random() * 100).toFixed(2)),
  }
}

export default function ClusterComparisonPage({ clusterIds }: ClusterComparisonPageProps) {
  const [clusters, setClusters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch cluster data
    setLoading(true)

    setTimeout(() => {
      const fetchedClusters = clusterIds.map((id) => getClusterData(id))
      setClusters(fetchedClusters)
      setLoading(false)
    }, 1500)
  }, [clusterIds])

  if (clusterIds.length < 2) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Cluster Comparison"
          breadcrumbs={[
            { name: "Clusters", href: "/clusters" },
            { name: "Compare", href: "/clusters/compare", current: true },
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Invalid Comparison</CardTitle>
            <CardDescription>Please select at least two clusters to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/clusters">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Clusters
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cluster Comparison"
        description={`Comparing ${clusterIds.length} clusters`}
        breadcrumbs={[
          { name: "Clusters", href: "/clusters" },
          { name: "Compare", href: "/clusters/compare", current: true },
        ]}
      />

      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/clusters">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clusters
          </Link>
        </Button>

        {!loading && <ExportDialog data={clusters} filename="cluster-comparison" />}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: clusterIds.length }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {clusters.map((cluster) => (
            <Card key={cluster.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  <Link href={`/clusters/${cluster.id}`} className="hover:underline">
                    {cluster.id}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cluster.size} proteins</div>
                <p className="text-xs text-muted-foreground">
                  {cluster.speciesCount} species, {cluster.conservationScore} conservation
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proteins">Proteins</TabsTrigger>
          <TabsTrigger value="species">Species</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            <Card>
              <CardHeader>
                <CardTitle>Cluster Overlap</CardTitle>
                <CardDescription>Venn diagram showing protein overlap between clusters</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-lg" />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Cluster Overlap</CardTitle>
                <CardDescription>Venn diagram showing protein overlap between clusters</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ComparisonVennDiagram clusters={clusters} />
              </CardContent>
            </Card>
          )}

          {loading ? (
            <Card>
              <CardHeader>
                <CardTitle>Cluster Metrics Comparison</CardTitle>
                <CardDescription>Comparing key metrics across selected clusters</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-lg" />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Cluster Metrics Comparison</CardTitle>
                <CardDescription>Comparing key metrics across selected clusters</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ComparisonBarChart clusters={clusters} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="proteins" className="space-y-4">
          {loading ? (
            <Card>
              <CardHeader>
                <CardTitle>Protein Comparison</CardTitle>
                <CardDescription>Detailed comparison of proteins across clusters</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[500px] w-full rounded-lg" />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Protein Comparison</CardTitle>
                <CardDescription>Detailed comparison of proteins across clusters</CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonTable clusters={clusters} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="species" className="space-y-4">
          {loading ? (
            <Card>
              <CardHeader>
                <CardTitle>Species Distribution Comparison</CardTitle>
                <CardDescription>Comparing species distribution across clusters</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-lg" />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Species Distribution Comparison</CardTitle>
                <CardDescription>Comparing species distribution across clusters</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {/* Species comparison visualization would go here */}
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Species distribution comparison visualization
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

