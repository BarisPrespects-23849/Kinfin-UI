import type { Metadata } from "next"
import ClustersPage from "@/components/clusters/clusters-page"

export const metadata: Metadata = {
  title: "KinFin - Clusters",
  description: "Browse and filter protein clusters",
}

export default function Clusters() {
  return <ClustersPage />
}

