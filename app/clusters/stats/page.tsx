import type { Metadata } from "next"
import ClusterStatsPage from "@/components/clusters/cluster-stats-page"

export const metadata: Metadata = {
  title: "KinFin - Cluster Statistics",
  description: "Advanced statistics for protein clusters",
}

export default function ClusterStats() {
  return <ClusterStatsPage />
}

