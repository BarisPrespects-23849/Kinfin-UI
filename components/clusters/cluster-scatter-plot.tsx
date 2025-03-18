"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { clusters } from "@/lib/data"

export function ClusterScatterPlot() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create a group for the plot
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(clusters, (d) => d.size) || 0])
      .range([0, innerWidth])
      .nice()

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(clusters, (d) => d.speciesCount) || 0])
      .range([innerHeight, 0])
      .nice()

    // Create color scale for taxonomic groups
    const taxonomicGroups = Array.from(new Set(clusters.map((d) => d.taxonomicGroup)))
    const colorScale = d3.scaleOrdinal().domain(taxonomicGroups).range(d3.schemeCategory10)

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", 30)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text("Cluster Size")

    // Add y-axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -innerHeight / 2)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text("Species Count")

    // Add scatter points
    g.selectAll("circle")
      .data(clusters)
      .join("circle")
      .attr("cx", (d) => xScale(d.size))
      .attr("cy", (d) => yScale(d.speciesCount))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d.taxonomicGroup) as string)
      .attr("opacity", 0.7)
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .append("title")
      .text((d) => `${d.id}\nSize: ${d.size}\nSpecies: ${d.speciesCount}\nGroup: ${d.taxonomicGroup}`)

    // Add a trend line
    const line = d3
      .line<(typeof clusters)[0]>()
      .x((d) => xScale(d.size))
      .y((d) => yScale(d.speciesCount))

    // Calculate trend line data points
    const xExtent = d3.extent(clusters, (d) => d.size) as [number, number]
    const xRange = xExtent[1] - xExtent[0]
    const xStep = xRange / 10

    // Simple linear regression
    const sumX = d3.sum(clusters, (d) => d.size)
    const sumY = d3.sum(clusters, (d) => d.speciesCount)
    const sumXY = d3.sum(clusters, (d) => d.size * d.speciesCount)
    const sumXX = d3.sum(clusters, (d) => d.size * d.size)
    const n = clusters.length

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    const trendData = Array.from({ length: 11 }, (_, i) => {
      const x = xExtent[0] + i * xStep
      return {
        size: x,
        speciesCount: slope * x + intercept,
      }
    })

    // Add trend line
    g.append("path")
      .datum(trendData)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("d", line as any)

    // Add legend
    const legend = svg.append("g").attr("transform", `translate(${width - margin.right - 120}, ${margin.top})`)

    taxonomicGroups.forEach((group, i) => {
      const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 20})`)

      legendRow
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", colorScale(group) as string)

      legendRow
        .append("text")
        .attr("x", 15)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .attr("fill", "currentColor")
        .style("font-size", "12px")
        .text(group)
    })
  }, [])

  return <svg ref={svgRef} width="100%" height="100%" />
}

