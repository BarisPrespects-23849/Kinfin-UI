"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { networkData } from "@/lib/data"
import { useMobile } from "@/hooks/use-mobile"

interface NetworkGraphProps {
  linkStrength: number
  isSimulating: boolean
  zoomLevel?: number
}

export function NetworkGraph({ linkStrength, isSimulating, zoomLevel = 1 }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const isMobile = useMobile()

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Create a group for the network
    const g = svg.append("g")

    // Add zoom functionality
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    zoomRef.current = zoom
    svg.call(zoom)

    // Create a color scale for the groups
    const colorScale = d3.scaleOrdinal([
      "hsl(221.2 83.2% 53.3%)",
      "hsl(262.1 83.3% 57.8%)",
      "hsl(291.1 92.5% 58.0%)",
      "hsl(322.1 91.4% 52.5%)",
      "hsl(349.7 89.2% 60.2%)",
    ])

    // Adjust node size based on screen size
    const getNodeRadius = (d: any) => {
      const baseSize = Math.sqrt(d.size) / 2
      return isMobile ? Math.min(baseSize, 10) + 3 : baseSize + 5
    }

    // Create a simulation with adjusted parameters for mobile
    const simulation = d3
      .forceSimulation(networkData.nodes)
      .force(
        "link",
        d3
          .forceLink(networkData.links)
          .id((d: any) => d.id)
          .distance(isMobile ? 80 : 120)
          .strength(linkStrength / 10),
      )
      .force("charge", d3.forceManyBody().strength(isMobile ? -100 : -150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))
      .force(
        "collide",
        d3.forceCollide().radius((d: any) => getNodeRadius(d) + 5),
      )

    simulationRef.current = simulation

    // Create links with gradient effect
    const linksGroup = g.append("g").attr("class", "links")

    // Create link gradients
    const defs = svg.append("defs")

    networkData.links.forEach((link, i) => {
      const gradientId = `link-gradient-${i}`
      const gradient = defs.append("linearGradient").attr("id", gradientId).attr("gradientUnits", "userSpaceOnUse")

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", (d) => {
          const sourceNode = networkData.nodes.find((n) => n.id === link.source)
          return colorScale(sourceNode?.group.toString() || "1")
        })

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", (d) => {
          const targetNode = networkData.nodes.find((n) => n.id === link.target)
          return colorScale(targetNode?.group.toString() || "1")
        })
    })

    const link = linksGroup
      .selectAll("line")
      .data(networkData.links)
      .join("line")
      .attr("stroke", (d, i) => `url(#link-gradient-${i})`)
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", (d) => Math.sqrt(d.value) * (isMobile ? 1 : 1.5))

    // Create nodes group
    const nodesGroup = g.append("g").attr("class", "nodes")

    // Create nodes
    const node = nodesGroup
      .selectAll("circle")
      .data(networkData.nodes)
      .join("circle")
      .attr("r", getNodeRadius)
      .attr("fill", (d) => colorScale(d.group.toString()))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("cursor", "pointer")
      .on("mouseover", (event, d) => {
        setHoveredNode(d.id)
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("stroke", "hsl(var(--primary))")
          .attr("stroke-width", 3)
      })
      .on("mouseout", (event, d) => {
        setHoveredNode(null)
        d3.select(event.currentTarget).transition().duration(200).attr("stroke", "#fff").attr("stroke-width", 2)
      })
      .call(drag(simulation))

    // Add node labels - only for desktop or larger nodes on mobile
    const labels = g
      .append("g")
      .selectAll("text")
      .data(networkData.nodes)
      .join("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text((d) => d.id)
      .attr("font-size", isMobile ? "9px" : "11px")
      .attr("font-weight", "500")
      .attr("fill", "currentColor")
      .attr("opacity", 0)
      .attr("paint-order", "stroke")
      .attr("stroke", "var(--background)")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("pointer-events", "none")

    // Add node tooltips - simplified for mobile
    const tooltips = g
      .append("g")
      .selectAll("g")
      .data(networkData.nodes)
      .join("g")
      .attr("class", "node-tooltip")
      .attr("opacity", 0)
      .attr("pointer-events", "none")

    tooltips.each(function (d) {
      const tooltip = d3.select(this)

      tooltip
        .append("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", isMobile ? 100 : 120)
        .attr("height", isMobile ? 50 : 60)
        .attr("fill", "var(--background)")
        .attr("stroke", "var(--border)")
        .attr("stroke-width", 1)
        .attr("opacity", 0.9)

      tooltip
        .append("text")
        .attr("x", 10)
        .attr("y", 20)
        .attr("font-weight", "bold")
        .attr("font-size", isMobile ? "10px" : "12px")
        .attr("fill", "currentColor")
        .text(d.id)

      tooltip
        .append("text")
        .attr("x", 10)
        .attr("y", 40)
        .attr("font-size", isMobile ? "9px" : "11px")
        .attr("fill", "currentColor")
        .text(`Size: ${d.size}`)

      if (!isMobile) {
        tooltip
          .append("text")
          .attr("x", 10)
          .attr("y", 55)
          .attr("font-size", "11px")
          .attr("fill", "currentColor")
          .text(`Group: ${d.group}`)
      }
    })

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)

      labels.attr("x", (d) => d.x).attr("y", (d) => d.y)

      // Update tooltip positions
      tooltips
        .attr("transform", (d) => `translate(${d.x + 15},${d.y - (isMobile ? 60 : 70)})`)
        .attr("opacity", (d) => (d.id === hoveredNode ? 1 : 0))

      // Show labels for hovered node and its connections
      if (hoveredNode) {
        const connectedNodes = new Set()
        networkData.links.forEach((link) => {
          if (link.source.id === hoveredNode) connectedNodes.add(link.target.id)
          if (link.target.id === hoveredNode) connectedNodes.add(link.source.id)
        })

        labels.attr("opacity", (d) => {
          if (d.id === hoveredNode) return 1
          if (connectedNodes.has(d.id)) return 0.8
          return 0
        })
      } else {
        // Show labels only for larger nodes when not hovering
        labels.attr("opacity", (d) => {
          if (isMobile) {
            return d.size > 300 ? 0.8 : 0
          } else {
            return d.size > 200 ? 0.8 : 0
          }
        })
      }
    })

    // Drag functionality
    function drag(simulation: d3.Simulation<any, any>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged(event: any) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
    }

    // Initial zoom to fit
    const initialScale = isMobile ? 0.6 : 0.8
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initialScale)
        .translate(-width / 2, -height / 2),
    )

    return () => {
      simulation.stop()
    }
  }, [isMobile])

  // Update link strength when it changes
  useEffect(() => {
    if (simulationRef.current) {
      const linkForce = simulationRef.current.force("link") as d3.ForceLink<any, any>
      if (linkForce) {
        linkForce.strength(linkStrength / 10)
        simulationRef.current.alpha(0.3).restart()
      }
    }
  }, [linkStrength])

  // Pause/resume simulation
  useEffect(() => {
    if (simulationRef.current) {
      if (isSimulating) {
        simulationRef.current.alpha(0.3).restart()
      } else {
        simulationRef.current.stop()
      }
    }
  }, [isSimulating])

  // Update zoom level when it changes
  useEffect(() => {
    if (zoomRef.current && svgRef.current) {
      const svg = d3.select(svgRef.current)
      const width = svgRef.current.clientWidth
      const height = svgRef.current.clientHeight

      svg
        .transition()
        .duration(300)
        .call(
          zoomRef.current.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(zoomLevel)
            .translate(-width / 2, -height / 2),
        )
    }
  }, [zoomLevel])

  return (
    <div className="network-graph-container w-full h-full touch-manipulation">
      <style jsx global>{`
        .network-graph-container text {
          font-family: var(--font-sans);
          letter-spacing: -0.01em;
        }
        
        @media (prefers-color-scheme: dark) {
          .network-graph-container text {
            stroke: hsl(var(--background));
          }
        }
        
        /* Optimize for touch devices */
        @media (pointer: coarse) {
          .network-graph-container {
            touch-action: none;
          }
        }
        
        /* Hide scrollbars */
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  )
}

