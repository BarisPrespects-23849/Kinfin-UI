"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { taxonomyData, taxonomicGroups } from "@/lib/data"
import { TaxonomyTreemap } from "./taxonomy-treemap"
import { TaxonomyHierarchy } from "./taxonomy-hierarchy"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { ExportDialog } from "@/components/export-dialog"
import { TaxonomySunburst } from "./taxonomy-sunburst"
import { useMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Maximize2, Minimize2 } from "lucide-react"

export default function TaxonomyPage() {
  const isMobile = useMobile()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeViz, setActiveViz] = useState("treemap")

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Taxonomy Analysis"
        description="Hierarchical analysis of taxonomic relationships"
        breadcrumbs={[{ name: "Taxonomy", href: "/taxonomy", current: true }]}
      />

      <div className="flex items-center justify-end">
        <ExportDialog
          data={taxonomyData}
          filename="taxonomy-data"
          trigger={
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {isMobile ? "Export" : "Export Taxonomy Data"}
            </Button>
          }
        />
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
        {taxonomicGroups.map((group) => (
          <Card key={group.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{group.value.toLocaleString()}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {((group.value / taxonomicGroups.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% of
                clusters
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className={isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}>
        {isFullscreen && (
          <Button variant="outline" size="icon" className="absolute right-4 top-4 z-10" onClick={toggleFullscreen}>
            <Minimize2 className="h-4 w-4" />
            <span className="sr-only">Exit fullscreen</span>
          </Button>
        )}
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Taxonomic Distribution</CardTitle>
              <CardDescription>Visualization of taxonomic relationships</CardDescription>
            </div>
            {!isFullscreen && (
              <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                <Maximize2 className="h-4 w-4" />
                <span className="sr-only">Fullscreen</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="treemap" className="space-y-4" value={activeViz} onValueChange={setActiveViz}>
            <TabsList className="w-full sm:w-auto flex overflow-x-auto no-scrollbar">
              <TabsTrigger value="treemap" className="flex-1 sm:flex-none">
                Treemap
              </TabsTrigger>
              <TabsTrigger value="hierarchy" className="flex-1 sm:flex-none">
                Hierarchy
              </TabsTrigger>
              <TabsTrigger value="sunburst" className="flex-1 sm:flex-none">
                Sunburst
              </TabsTrigger>
            </TabsList>

            <div className={isFullscreen ? "h-[calc(100vh-180px)]" : "h-[350px] sm:h-[500px] md:h-[600px]"}>
              {activeViz === "treemap" && <TaxonomyTreemap data={taxonomyData} />}
              {activeViz === "hierarchy" && <TaxonomyHierarchy data={taxonomyData} />}
              {activeViz === "sunburst" && <TaxonomySunburst data={taxonomyData} />}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

