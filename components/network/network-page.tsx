"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NetworkGraph } from "./network-graph"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pause, Play, ZoomIn, ZoomOut, Download, Maximize2, Minimize2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { ExportDialog } from "@/components/export-dialog"
import { networkData } from "@/lib/data"
import { useMobile } from "@/hooks/use-mobile"

export default function NetworkPage() {
  const [linkStrength, setLinkStrength] = useState([5])
  const [isSimulating, setIsSimulating] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isMobile = useMobile()

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PageHeader
        title="Cluster Network"
        description="Interactive visualization of protein cluster relationships"
        breadcrumbs={[{ name: "Network", href: "/network", current: true }]}
      />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <ExportDialog
          data={networkData}
          filename="network-data"
          trigger={
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {isMobile ? "Export" : "Export Network Data"}
            </Button>
          }
        />
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
              <CardTitle>Protein Cluster Network</CardTitle>
              <CardDescription>Force-directed graph showing relationships between clusters</CardDescription>
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
          <div
            className={`relative ${isFullscreen ? "h-[calc(100vh-120px)]" : "h-[350px] sm:h-[500px] md:h-[600px] lg:h-[700px]"}`}
          >
            <NetworkGraph linkStrength={linkStrength[0]} isSimulating={isSimulating} zoomLevel={zoomLevel} />

            <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg border shadow-md">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1 w-full max-w-md">
                    <Label htmlFor="link-strength" className="text-xs sm:text-sm font-medium">
                      Link Strength: {linkStrength[0]}
                    </Label>
                    <Slider
                      id="link-strength"
                      min={1}
                      max={10}
                      step={1}
                      value={linkStrength}
                      onValueChange={setLinkStrength}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setIsSimulating(!isSimulating)}>
                      {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  <p>Node size represents cluster size. Edge thickness represents relationship strength.</p>
                  <p className="hidden sm:block">
                    Colors represent different taxonomic groups. Use mouse wheel to zoom and drag to pan the view.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

