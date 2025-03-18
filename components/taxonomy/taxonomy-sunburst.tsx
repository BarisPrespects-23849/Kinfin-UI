"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useMobile } from "@/hooks/use-mobile"

interface SunburstData {
  name: string
  value?: number
  children?: SunburstData[]
}

interface TaxonomySunburstProps {
  data: SunburstData
}

export function TaxonomySunburst({ data }: TaxonomySunburstProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState<{ name: string; value: number; x: number; y: number } | null>(null)
  const [focusedNode, setFocusedNode] = useState<d3.HierarchyRectangularNode<SunburstData> | null>(null)
  const isMobile = useMobile()

  useEffect(() => {
    if (!svgRef.current || !data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const radius = Math.min(width, height) / 2

    // Create a group for the sunburst
    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`)

    // Create a hierarchical structure
    const root = d3.hierarchy(data).sum((d) => d.value || 0)

    // Create a partition layout
    const partition = d3.partition<SunburstData>().size([2 * Math.PI, radius])

    // Apply the partition layout to the hierarchy
    partition(root)

    // Create an arc generator
    const arc = d3
      .arc<d3.HierarchyRectangularNode<SunburstData>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1)

    // Create a color scale
    const colorScale = d3.scaleOrdinal(d3.schemeBlues[9])

    // Create the sunburst segments
    const path = g
      .selectAll("path")
      .data(root.descendants().filter((d) => d.depth))
      .join("path")
      .attr("fill", (d) => {
        while (d.depth > 1) d = d.parent!
        return colorScale(d.data.name)
      })
      .attr("fill-opacity", (d) => 1.0 - d.depth * 0.1)
      .attr("d", arc as any)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("cursor", "pointer")
      .on("mouseover", (event, d) => {
        setTooltip({
          name: d.data.name,
          value: d.value || 0,
          x: event.pageX,
          y: event.pageY,
        })

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("fill-opacity", (d) => 1.0)
      })
      .on("mouseout", (event) => {
        setTooltip(null)

        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("fill-opacity", (d) => 1.0 - d.depth * 0.1)
      })
      .on("click", (event, d) => {
        setFocusedNode(focusedNode === d ? null : d)
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

    // Add labels for larger segments
    const label = g
      .selectAll("text")
      .data(
        root.descendants().filter((d) => {
          // Adjust label visibility threshold for mobile
          const threshold = isMobile ? 0.05 : 0.03
          return d.depth && (d.y1 - d.y0) * (d.x1 - d.x0) > threshold
        }),
      )
      .join("text")
      .attr("transform", (d) => {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI
        const y = (d.y0 + d.y1) / 2
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("font-size", isMobile ? "9px" : "11px")
      .attr("font-weight", "500")
      .attr("fill", "white")
      .attr("paint-order", "stroke")
      .attr("stroke", "rgba(0,0,0,0.3)")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .text((d) => {
        // Truncate text for mobile
        const name = d.data.name
        if (isMobile && name.length > 8) {
          return `${name.substring(0, 8)}...`
        }
        return name
      })

    // Add center circle
    g.append("circle")
      .attr("r", 5)
      .attr("fill", "white")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2)
      .attr("cursor", "pointer")
      .on("click", () => {
        setFocusedNode(null)
      })

    // Add center text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", isMobile ? "10px" : "12px")
      .attr("font-weight", "bold")
      .attr("fill", "currentColor")
      .text("All")
  }, [data, isMobile])

  useEffect(() => {
    if (!focusedNode || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    const g = svg.select("g")

    const radius = Math.min(svgRef.current.clientWidth, svgRef.current.clientHeight) / 2

    const arc = d3
      .arc<d3.HierarchyRectangularNode<SunburstData>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1)

    const path = g.selectAll("path")

    // Animate transition to focused node
    path
      .transition()
      .duration(750)
      .attrTween("d", (d) => {
        const interpolate = d3.interpolate(
          { x0: d.x0, x1: d.x1, y0: d.y0, y1: d.y1 },
          {
            x0: d.x0 - focusedNode.x0,
            x1: d.x1 - focusedNode.x0,
            y0: (d.y0 / focusedNode.y1) * radius,
            y1: (d.y1 / focusedNode.y1) * radius,
          },
        )
        return (t) => arc(interpolate(t) as any)
      })
  }, [focusedNode])

  return (
    <div className="relative w-full h-full touch-manipulation">
      <style jsx global>{`
        /* Optimize for touch devices */
        @media (pointer: coarse) {
          .touch-manipulation {
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

