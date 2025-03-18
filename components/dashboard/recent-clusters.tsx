import { Badge } from "@/components/ui/badge"
import { clusters } from "@/lib/data"
import Link from "next/link"

export function RecentClusters() {
  // Get 5 random clusters to simulate "recent" clusters
  const recentClusters = clusters.slice(0, 5)

  return (
    <div className="space-y-4">
      {recentClusters.map((cluster) => (
        <div key={cluster.id} className="flex flex-col space-y-1">
          <div className="flex items-center">
            <Link href={`/clusters/${cluster.id}`} className="font-medium hover:underline">
              {cluster.id}
            </Link>
            <Badge variant="outline" className="ml-2">
              {cluster.taxonomicGroup}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {cluster.size} proteins, {cluster.speciesCount} species
          </div>
        </div>
      ))}
    </div>
  )
}

