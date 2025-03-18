"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface ComparisonVennDiagramProps {
  clusters: any[]
}

export function ComparisonVennDiagram({ clusters }: ComparisonVennDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !clusters.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Create a group for the diagram
    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`)

    // For simplicity, we'll create a basic Venn diagram
    // In a real app, you would calculate actual intersections

    // For 2 clusters
    if (clusters.length === 2) {
      const radius = Math.min(width, height) / 4
      const distance = radius * 1.2

      // First circle
      g.append("circle")
        .attr("cx", -distance / 2)
        .attr("cy", 0)
        .attr("r", radius)
        .attr("fill", "hsl(var(--primary) / 0.5)")
        .attr("stroke", "hsl(var(--primary))")
        .attr("stroke-width", 2)

      // Second circle
      g.append("circle")
        .attr("cx", distance / 2)
        .attr("cy", 0)
        .attr("r", radius)
        .attr("fill", "hsl(262.1 83.3% 57.8% / 0.5)")
        .attr("stroke", "hsl(262.1 83.3% 57.8%)")
        .attr("stroke-width", 2)

      // Labels
      g.append("text")
        .attr("x", -distance)
        .attr("y", -radius - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .text(clusters[0].id)

      g.append("text")
        .attr("x", distance)
        .attr("y", -radius - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .text(clusters[1].id)

      // Counts
      g.append("text")
        .attr("x", -distance)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .text(Math.floor(clusters[0].size * 0.7))

      g.append("text")
        .attr("x", distance)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .text(Math.floor(clusters[1].size * 0.7))

      // Intersection
      g.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .text(Math.floor(Math.min(clusters[0].size, clusters[1].size) * 0.3))
    }
    // For 3 clusters
    else if (clusters.length === 3) {
      const radius = Math.min(width, height) / 5
      const angle = (2 * Math.PI) / 3

      // Calculate positions
      const positions = [0, 1, 2].map((i) => ({
        x: radius * 1.2 * Math.cos(i * angle),
        y: radius * 1.2 * Math.sin(i * angle),
      }))

      // Colors
      const colors = ["hsl(var(--primary))", "hsl(262.1 83.3% 57.8%)", "hsl(349.7 89.2% 60.2%)"]

      // Draw circles
      positions.forEach((pos, i) => {
        g.append("circle")
          .attr("cx", pos.x)
          .attr("cy", pos.y)
          .attr("r", radius)
          .attr("fill", `${colors[i]} / 0.5`)
          .attr("stroke", colors[i])
          .attr("stroke-width", 2)

        // Labels
        g.append("text")
          .attr("x", pos.x * 1.5)
          .attr("y", pos.y * 1.5)
          .attr("text-anchor", "middle")
          .attr("fill", "currentColor")
          .attr("font-weight", "bold")
          .text(clusters[i].id)

        // Counts (unique to this circle)
        g.append("text")
          .attr("x", pos.x * 1.2)
          .attr("y", pos.y * 1.2)
          .attr("text-anchor", "middle")
          .attr("fill", "currentColor")
          .attr("font-weight", "bold")
          .text(Math.floor(clusters[i].size * 0.6))
      })

      // Center intersection
      g.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .text(Math.floor(Math.min(...clusters.map((c) => c.size)) * 0.1))
    }
    // For more clusters, we'd need a more complex visualization
    else {
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .attr("font-size", "16px")
        .text("Complex Venn diagram with " + clusters.length + " clusters")
    }
  }, [clusters])

  return <svg ref={svgRef} width="100%" height="100%" />
}

