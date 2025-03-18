import type { Metadata } from "next"
import VisualizationsPage from "@/components/visualizations/visualizations-page"

export const metadata: Metadata = {
  title: "KinFin - Visualizations",
  description: "Interactive visualizations of protein clustering data",
}

export default function Visualizations() {
  return <VisualizationsPage />
}

