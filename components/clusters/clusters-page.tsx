"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { clusters } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { ExportDialog } from "@/components/export-dialog"
import { ComparisonDialog } from "@/components/cluster-comparison/comparison-dialog"
import { Skeleton } from "@/components/ui/skeleton"

type Cluster = (typeof clusters)[0]

export default function ClustersPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const columns: ColumnDef<Cluster>[] = [
    {
      accessorKey: "id",
      header: "Cluster ID",
      cell: ({ row }) => (
        <Link href={`/clusters/${row.getValue("id")}`} className="font-medium hover:underline">
          {row.getValue("id")}
        </Link>
      ),
    },
    {
      accessorKey: "size",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Size
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("size")}</div>,
    },
    {
      accessorKey: "speciesCount",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Species Count
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("speciesCount")}</div>,
    },
    {
      accessorKey: "taxonomicGroup",
      header: "Taxonomic Group",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("taxonomicGroup")}</Badge>,
    },
    {
      accessorKey: "functionalAnnotation",
      header: "Function",
      cell: ({ row }) => <div>{row.getValue("functionalAnnotation")}</div>,
    },
    {
      accessorKey: "conservationScore",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Conservation Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("conservationScore")}</div>,
    },
  ]

  const table = useReactTable({
    data: clusters,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Protein Clusters"
        description="Browse and filter protein clusters"
        breadcrumbs={[{ name: "Clusters", href: "/clusters", current: true }]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/clusters/stats">
              <BarChart3 className="mr-2 h-4 w-4" />
              Cluster Statistics
            </Link>
          </Button>

          <ComparisonDialog />
        </div>

        <ExportDialog data={clusters} filename="kinfin-clusters" />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Input
              placeholder="Filter by ID..."
              value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />

            <Select
              value={(table.getColumn("taxonomicGroup")?.getFilterValue() as string) ?? ""}
              onValueChange={(value) => table.getColumn("taxonomicGroup")?.setFilterValue(value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Taxonomic Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="Bacteria">Bacteria</SelectItem>
                <SelectItem value="Fungi">Fungi</SelectItem>
                <SelectItem value="Plants">Plants</SelectItem>
                <SelectItem value="Invertebrates">Invertebrates</SelectItem>
                <SelectItem value="Vertebrates">Vertebrates</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: columns.length }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length} clusters
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

