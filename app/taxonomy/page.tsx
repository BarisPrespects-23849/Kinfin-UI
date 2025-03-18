import type { Metadata } from "next"
import TaxonomyPage from "@/components/taxonomy/taxonomy-page"

export const metadata: Metadata = {
  title: "KinFin - Taxonomy",
  description: "Taxonomic analysis of protein clusters",
}

export default function Taxonomy() {
  return <TaxonomyPage />
}

