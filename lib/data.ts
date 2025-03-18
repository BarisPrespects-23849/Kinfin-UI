// Mock data for the KinFin application

// Summary statistics for the dashboard
export const summaryStats = {
  totalClusters: 12458,
  totalProteins: 1245789,
  totalSpecies: 42,
  averageClusterSize: 100,
  singletonClusters: 3245,
  multiSpeciesClusters: 9213,
}

// Cluster distribution by size
export const clusterSizeDistribution = [
  { name: "1", value: 3245 },
  { name: "2-5", value: 4567 },
  { name: "6-10", value: 2134 },
  { name: "11-20", value: 1245 },
  { name: "21-50", value: 876 },
  { name: "51-100", value: 234 },
  { name: ">100", value: 157 },
]

// Species distribution in clusters
export const speciesDistribution = [
  { name: "E. coli", value: 2345 },
  { name: "S. cerevisiae", value: 1987 },
  { name: "H. sapiens", value: 3456 },
  { name: "M. musculus", value: 2876 },
  { name: "D. melanogaster", value: 1765 },
  { name: "Other", value: 29 },
]

// Taxonomic group distribution
export const taxonomicGroups = [
  { name: "Bacteria", value: 4567 },
  { name: "Fungi", value: 2345 },
  { name: "Plants", value: 1234 },
  { name: "Invertebrates", value: 2456 },
  { name: "Vertebrates", value: 1856 },
]

// Mock cluster data for the clusters table
export const clusters = Array.from({ length: 100 }, (_, i) => ({
  id: `CL_${(i + 1).toString().padStart(5, "0")}`,
  size: Math.floor(Math.random() * 500) + 1,
  speciesCount: Math.floor(Math.random() * 42) + 1,
  taxonomicGroup: ["Bacteria", "Fungi", "Plants", "Invertebrates", "Vertebrates"][Math.floor(Math.random() * 5)],
  functionalAnnotation: ["Metabolism", "Cell signaling", "Transcription", "Translation", "Transport", "Unknown"][
    Math.floor(Math.random() * 6)
  ],
  conservationScore: Number.parseFloat((Math.random() * 100).toFixed(2)),
}))

// Mock data for a specific cluster
export const clusterDetail = {
  id: "CL_00001",
  size: 245,
  speciesCount: 18,
  taxonomicGroup: "Bacteria",
  functionalAnnotation: "Metabolism",
  conservationScore: 87.5,
  proteins: Array.from({ length: 20 }, (_, i) => ({
    id: `PROT_${(i + 1).toString().padStart(5, "0")}`,
    species: ["E. coli", "S. cerevisiae", "H. sapiens", "M. musculus", "D. melanogaster"][
      Math.floor(Math.random() * 5)
    ],
    length: Math.floor(Math.random() * 1000) + 100,
    function: ["Enzyme", "Transporter", "Receptor", "Structural protein", "Transcription factor", "Unknown"][
      Math.floor(Math.random() * 6)
    ],
  })),
  speciesDistribution: [
    { name: "E. coli", value: 45 },
    { name: "S. cerevisiae", value: 38 },
    { name: "H. sapiens", value: 56 },
    { name: "M. musculus", value: 42 },
    { name: "D. melanogaster", value: 35 },
    { name: "Other", value: 29 },
  ],
  domainArchitecture: [
    { name: "Kinase", count: 78 },
    { name: "SH2", count: 45 },
    { name: "SH3", count: 32 },
    { name: "PDZ", count: 18 },
    { name: "Other", count: 72 },
  ],
}

// Mock taxonomy data
export const taxonomyData = {
  name: "All",
  value: 12458,
  children: [
    {
      name: "Bacteria",
      value: 4567,
      children: [
        { name: "Proteobacteria", value: 2345 },
        { name: "Firmicutes", value: 1234 },
        { name: "Other Bacteria", value: 988 },
      ],
    },
    {
      name: "Eukaryota",
      value: 7891,
      children: [
        {
          name: "Fungi",
          value: 2345,
          children: [
            { name: "Ascomycota", value: 1456 },
            { name: "Basidiomycota", value: 889 },
          ],
        },
        {
          name: "Metazoa",
          value: 4312,
          children: [
            {
              name: "Vertebrata",
              value: 1856,
              children: [
                { name: "Mammalia", value: 1234 },
                { name: "Other Vertebrates", value: 622 },
              ],
            },
            {
              name: "Invertebrata",
              value: 2456,
              children: [
                { name: "Arthropoda", value: 1567 },
                { name: "Other Invertebrates", value: 889 },
              ],
            },
          ],
        },
        {
          name: "Plantae",
          value: 1234,
          children: [
            { name: "Angiosperms", value: 987 },
            { name: "Other Plants", value: 247 },
          ],
        },
      ],
    },
  ],
}

// Mock network data for the network visualization
export const networkData = {
  nodes: Array.from({ length: 50 }, (_, i) => ({
    id: `CL_${(i + 1).toString().padStart(5, "0")}`,
    size: Math.floor(Math.random() * 500) + 1,
    group: Math.floor(Math.random() * 5) + 1,
  })),
  links: Array.from({ length: 80 }, () => {
    const source = Math.floor(Math.random() * 50)
    let target = Math.floor(Math.random() * 50)
    while (target === source) {
      target = Math.floor(Math.random() * 50)
    }
    return {
      source: `CL_${(source + 1).toString().padStart(5, "0")}`,
      target: `CL_${(target + 1).toString().padStart(5, "0")}`,
      value: Math.floor(Math.random() * 10) + 1,
    }
  }),
}

