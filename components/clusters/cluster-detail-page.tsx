"use client"
import { ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { clusterDetail } from "@/lib/data"
import { ClusterProteinsTable } from "./cluster-proteins-table"
import { ClusterSpeciesChart } from "./cluster-species-chart"
import { ClusterDomainChart } from "./cluster-domain-chart"
import { PageHeader } from "@/components/page-header"
import { ExportDialog } from "@/components/export-dialog"
import { ComparisonDialog } from "@/components/cluster-comparison/comparison-dialog"
import { useToast } from "@/hooks/use-toast"

interface ClusterDetailPageProps {
  id: string
}

export default function ClusterDetailPage({ id }: ClusterDetailPageProps) {
  // In a real app, we would fetch the cluster data based on the ID
  // For this demo, we'll use the mock data
  const cluster = { ...clusterDetail, id }
  const { toast } = useToast()

  const handleShare = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href)

    toast({
      title: "Link copied",
      description: "Cluster link copied to clipboard",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Cluster ${id}`}
        description="Detailed information about this protein cluster"
        breadcrumbs={[
          { name: "Clusters", href: "/clusters" },
          { name: id, href: `/clusters/${id}`, current: true },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/clusters">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clusters
            </Link>
          </Button>

          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <ComparisonDialog
            trigger={
              <Button variant="outline" size="sm">
                Compare with other clusters
              </Button>
            }
          />
        </div>

        <ExportDialog data={cluster} filename={`cluster-${id}`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Cluster Size</CardTitle>
            <CardDescription>Number of proteins in cluster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cluster.size}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Species Count</CardTitle>
            <CardDescription>Number of species in cluster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cluster.speciesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conservation Score</CardTitle>
            <CardDescription>Evolutionary conservation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cluster.conservationScore}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="proteins" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proteins">Proteins</TabsTrigger>
          <TabsTrigger value="species">Species Distribution</TabsTrigger>
          <TabsTrigger value="domains">Domain Architecture</TabsTrigger>
        </TabsList>

        <TabsContent value="proteins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proteins in Cluster</CardTitle>
              <CardDescription>List of proteins belonging to this cluster</CardDescription>
            </CardHeader>
            <CardContent>
              <ClusterProteinsTable proteins={cluster.proteins} />
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
              <ClusterSpeciesChart data={cluster.speciesDistribution} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Architecture</CardTitle>
              <CardDescription>Protein domains found in this cluster</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ClusterDomainChart data={cluster.domainArchitecture} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

