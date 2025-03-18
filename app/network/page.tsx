import type { Metadata } from "next"
import NetworkPage from "@/components/network/network-page"

export const metadata: Metadata = {
  title: "KinFin - Network",
  description: "Network visualization of protein clusters",
}

export default function Network() {
  return <NetworkPage />
}

