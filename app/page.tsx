import type { Metadata } from "next"
import DashboardPage from "@/components/dashboard/dashboard-page"

export const metadata: Metadata = {
  title: "KinFin - Dashboard",
  description: "KinFin bioinformatics dashboard for protein clustering analysis",
}

export default function Home() {
  return <DashboardPage />
}

