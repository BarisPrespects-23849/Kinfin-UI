"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ComparisonTableProps {
  clusters: any[]
}

export function ComparisonTable({ clusters }: ComparisonTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Generate mock protein data for comparison
  // In a real app, this would come from the API
  const generateProteinData = () => {
    const allProteins: any[] = []

    // Create a set of proteins that appear in multiple clusters
    const sharedProteins = Array.from({ length: 10 }, (_, i) => ({
      id: `PROT_SHARED_${(i + 1).toString().padStart(5, "0")}`,
      function: ["Enzyme", "Transporter", "Receptor", "Structural protein"][Math.floor(Math.random() * 4)],
      length: Math.floor(Math.random() * 1000) + 100,
      clusters: clusters.filter(() => Math.random() > 0.3).map((c) => c.id),
    }))

    // Add unique proteins for each cluster
    clusters.forEach((cluster) => {
      const uniqueProteins = Array.from({ length: 5 }, (_, i) => ({
        id: `PROT_${cluster.id}_${(i + 1).toString().padStart(5, "0")}`,
        function: ["Enzyme", "Transporter", "Receptor", "Structural protein"][Math.floor(Math.random() * 4)],
        length: Math.floor(Math.random() * 1000) + 100,
        clusters: [cluster.id],
      }))

      allProteins.push(...uniqueProteins)
    })

    return [...sharedProteins, ...allProteins]
  }

  const proteins = generateProteinData()

  // Filter proteins based on search term
  const filteredProteins = proteins.filter(
    (protein) =>
      protein.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protein.function.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search proteins..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protein ID</TableHead>
              <TableHead>Function</TableHead>
              <TableHead>Length</TableHead>
              {clusters.map((cluster) => (
                <TableHead key={cluster.id}>{cluster.id}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProteins.length > 0 ? (
              filteredProteins.map((protein) => (
                <TableRow key={protein.id}>
                  <TableCell className="font-medium">{protein.id}</TableCell>
                  <TableCell>{protein.function}</TableCell>
                  <TableCell>{protein.length}</TableCell>
                  {clusters.map((cluster) => (
                    <TableCell key={cluster.id}>
                      {protein.clusters.includes(cluster.id) ? (
                        <Badge variant="outline" className="bg-primary/20">
                          Present
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Absent</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3 + clusters.length} className="h-24 text-center">
                  No proteins found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

