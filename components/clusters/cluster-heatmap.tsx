"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export function ClusterHeatmap() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const margin = { top: 50, right: 50, bottom: 70, left: 70 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Generate mock data for the heatmap
    const species = [
      "E. coli",
      "S. cerevisiae",
      "H. sapiens",
      "M. musculus",
      "D. melanogaster",
      "C. elegans",
      "A. thaliana",
      "S. pombe",
    ]
    const clusters = Array.from({ length: 15 }, (_, i) => `CL_${(i + 1).toString().padStart(5, "0")}`)

    const data = []
    for (let i = 0; i < species.length; i++) {
      for (let j = 0; j < clusters.length; j++) {
        data.push({
          species: species[i],
          cluster: clusters[j],
          value: Math.random(), // Random value between 0 and 1
        })
      }
    }

    // Create scales
    const xScale = d3.scaleBand().domain(clusters).range([0, innerWidth]).padding(0.05)

    const yScale = d3.scaleBand().domain(species).range([0, innerHeight]).padding(0.05)

    const colorScale = d3.scaleSequential().interpolator(d3.interpolateBlues).domain([0, 1])

    // Create a group for the heatmap
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Add cells
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => xScale(d.cluster) || 0)
      .attr("y", (d) => yScale(d.species) || 0)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.value))
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .append("title")
      .text((d) => `${d.species}, ${d.cluster}: ${d.value.toFixed(2)}`)

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .attr("text-anchor", "start")
      .attr("font-size", "10px")

    // Add y-axis
    g.append("g").call(d3.axisLeft(yScale)).selectAll("text").attr("font-size", "10px")

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "currentColor")
      .text("Cluster Presence Across Species")

    // Add color legend
    const legendWidth = 200
    const legendHeight = 20

    const legendX = width - margin.right - legendWidth
    const legendY = margin.top / 2 - 10

    const defs = svg.append("defs")

    const linearGradient = defs.append("linearGradient").attr("id", "linear-gradient")

    linearGradient.attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%")

    linearGradient
      .selectAll("stop")
      .data([
        { offset: "0%", color: colorScale(0) },
        { offset: "100%", color: colorScale(1) },
      ])
      .join("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color)

    svg
      .append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#linear-gradient)")

    svg
      .append("text")
      .attr("x", legendX)
      .attr("y", legendY - 5)
      .attr("font-size", "10px")
      .attr("fill", "currentColor")
      .text("Low")

    svg
      .append("text")
      .attr("x", legendX + legendWidth)
      .attr("y", legendY - 5)
      .attr("text-anchor", "end")
      .attr("font-size", "10px")
      .attr("fill", "currentColor")
      .text("High")
  }, [])

  return <svg ref={svgRef} width="100%" height="100%" />
}

