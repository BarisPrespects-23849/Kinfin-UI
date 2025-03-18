import type { Metadata } from "next"
import ClusterDetailPage from "@/components/clusters/cluster-detail-page"

export const metadata: Metadata = {
  title: "KinFin - Cluster Detail",
  description: "Detailed view of a protein cluster",
}

export default function ClusterDetail({ params }: { params: { id: string } }) {
  return <ClusterDetailPage id={params.id} />
}

