"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { useMobile } from "@/hooks/use-mobile"

interface HierarchyData {
  name: string
  value?: number
  children?: HierarchyData[]
}

interface TaxonomyHierarchyProps {
  data: HierarchyData
}

export function TaxonomyHierarchy({ data }: TaxonomyHierarchyProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    if (!svgRef.current || !data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const margin = {
      top: 10,
      right: isMobile ? 80 : 150,
      bottom: 10,
      left: isMobile ? 40 : 60,
    }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create a hierarchical structure
    const root = d3.hierarchy(data)

    // Create a tree layout
    const treeLayout = d3.tree<HierarchyData>().size([innerHeight, innerWidth])

    // Apply the tree layout to the hierarchy
    treeLayout(root)

    // Create a group for the tree
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Add links between nodes
    g.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal<d3.HierarchyPointLink<HierarchyData>, d3.HierarchyPointNode<HierarchyData>>()
          .x((d) => d.y)
          .y((d) => d.x),
      )
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 1.5)

    // Add nodes
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`)

    // Add circles for each node
    node
      .append("circle")
      .attr("r", isMobile ? 4 : 6)
      .attr("fill", (d) => (d.children ? "hsl(var(--primary))" : "hsl(var(--muted))"))
      .attr("stroke", "white")
      .attr("stroke-width", 2)

    // Add labels for each node with improved clarity
    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.children ? -8 : 8))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => {
        // Truncate text for mobile
        const name = d.data.name
        const value = d.data.value
        if (isMobile) {
          return name.length > 10 ? `${name.substring(0, 10)}... (${value})` : `${name} (${value})`
        }
        return `${name} (${value})`
      })
      .attr("font-size", isMobile ? "9px" : "12px")
      .attr("font-weight", "500")
      .attr("fill", "currentColor")
      .attr("paint-order", "stroke")
      .attr("stroke", "var(--background)")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("class", "taxonomy-node-text")

    // Add zoom functionality
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom)

    // Initial zoom to fit
    const initialScale = isMobile ? 0.6 : 0.8
    svg.call(zoom.transform, d3.zoomIdentity.translate(margin.left, margin.top).scale(initialScale))
  }, [data, isMobile])

  return (
    <div className="taxonomy-hierarchy-container w-full h-full touch-manipulation">
      <style jsx global>{`
        .taxonomy-hierarchy-container .taxonomy-node-text {
          font-family: var(--font-sans);
          letter-spacing: -0.01em;
        }
        
        @media (prefers-color-scheme: dark) {
          .taxonomy-hierarchy-container .taxonomy-node-text {
            stroke: hsl(var(--background));
          }
        }
        
        /* Optimize for touch devices */
        @media (pointer: coarse) {
          .taxonomy-hierarchy-container {
            touch-action: none;
          }
        }
      `}</style>
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  )
}

