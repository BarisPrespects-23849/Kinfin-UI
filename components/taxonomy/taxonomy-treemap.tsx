"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useMobile } from "@/hooks/use-mobile"

interface TreemapData {
  name: string
  value?: number
  children?: TreemapData[]
}

interface TaxonomyTreemapProps {
  data: TreemapData
}

export function TaxonomyTreemap({ data }: TaxonomyTreemapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState<{ name: string; value: number; x: number; y: number } | null>(null)
  const isMobile = useMobile()

  useEffect(() => {
    if (!svgRef.current || !data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Create a hierarchical structure
    const hierarchy = d3
      .hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    // Create a treemap layout
    const treemap = d3
      .treemap<TreemapData>()
      .size([width, height])
      .paddingOuter(3)
      .paddingTop(19)
      .paddingInner(2)
      .round(true)

    // Apply the treemap layout to the hierarchy
    const root = treemap(hierarchy)

    // Create a color scale
    const colorScale = d3.scaleOrdinal(d3.schemeBlues[9])

    // Create the treemap cells
    const cell = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
      .on("mouseover", (event, d) => {
        setTooltip({
          name: d.data.name,
          value: d.value || 0,
          x: event.pageX,
          y: event.pageY,
        })
      })
      .on("mousemove", (event) => {
        if (tooltip) {
          setTooltip({
            ...tooltip,
            x: event.pageX,
            y: event.pageY,
          })
        }
      })
      .on("mouseout", () => {
        setTooltip(null)
      })
      .on("touchstart", (event, d) => {
        // For touch devices
        event.preventDefault()
        setTooltip({
          name: d.data.name,
          value: d.value || 0,
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
        })
      })

    // Add rectangles for each cell
    cell
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => {
        while (d.depth > 1) d = d.parent!
        return d.depth === 0 ? "none" : colorScale(d.data.name)
      })
      .attr("fill-opacity", (d) => 0.7 + d.depth * 0.1)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)

    // Add text labels with improved clarity
    cell
      .filter((d) => d.x1 - d.x0 > (isMobile ? 30 : 40) && d.y1 - d.y0 > (isMobile ? 15 : 20))
      .append("text")
      .attr("x", 4)
      .attr("y", 14)
      .attr("fill", "currentColor")
      .attr("font-size", (d) => (d.depth === 1 ? (isMobile ? "10px" : "12px") : isMobile ? "9px" : "11px"))
      .attr("font-weight", (d) => (d.depth === 1 ? "bold" : "500"))
      .text((d) => {
        // Truncate text for mobile
        const name = d.data.name
        if (isMobile && name.length > 10) {
          return `${name.substring(0, 10)}...`
        }
        return name
      })
      .attr("paint-order", "stroke")
      .attr("stroke", "var(--background)")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("class", "treemap-label")

    // Add value labels with improved clarity
    cell
      .filter((d) => d.x1 - d.x0 > (isMobile ? 30 : 40) && d.y1 - d.y0 > (isMobile ? 30 : 40) && d.depth > 0)
      .append("text")
      .attr("x", 4)
      .attr("y", 30)
      .attr("fill", "currentColor")
      .attr("font-size", isMobile ? "9px" : "11px")
      .text((d) => d.value?.toLocaleString())
      .attr("paint-order", "stroke")
      .attr("stroke", "var(--background)")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("class", "treemap-value")

    // Add zoom functionality
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", (d: any) => {
          return `translate(${d.x0 * event.transform.k + event.transform.x},${d.y0 * event.transform.k + event.transform.y}) scale(${event.transform.k})`
        })
      })

    if (!isMobile) {
      svg.call(zoom)
    }
  }, [data, isMobile])

  return (
    <div className="taxonomy-treemap-container relative w-full h-full touch-manipulation">
      <style jsx global>{`
        .taxonomy-treemap-container .treemap-label,
        .taxonomy-treemap-container .treemap-value {
          font-family: var(--font-sans);
          letter-spacing: -0.01em;
        }
        
        @media (prefers-color-scheme: dark) {
          .taxonomy-treemap-container .treemap-label,
          .taxonomy-treemap-container .treemap-value {
            stroke: hsl(var(--background));
          }
        }
        
        /* Optimize for touch devices */
        @media (pointer: coarse) {
          .taxonomy-treemap-container {
            touch-action: none;
          }
        }
      `}</style>
      <svg ref={svgRef} width="100%" height="100%" />
      {tooltip && (
        <div
          className="absolute z-10 p-2 bg-background border rounded shadow-lg text-sm"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 40,
            pointerEvents: "none",
          }}
        >
          <div className="font-medium">{tooltip.name}</div>
          <div className="text-muted-foreground">{tooltip.value.toLocaleString()} clusters</div>
        </div>
      )}
    </div>
  )
}

