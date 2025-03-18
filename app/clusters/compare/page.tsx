import type { Metadata } from "next"
import ClusterComparisonPage from "@/components/cluster-comparison/cluster-comparison-page"

export const metadata: Metadata = {
  title: "KinFin - Cluster Comparison",
  description: "Compare multiple protein clusters",
}

export default function ClusterComparison({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract cluster IDs from query parameters
  const clusterIds = Array.isArray(searchParams.id) ? searchParams.id : searchParams.id ? [searchParams.id] : []

  return <ClusterComparisonPage clusterIds={clusterIds} />
}

