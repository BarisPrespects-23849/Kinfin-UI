"use client"

import type React from "react"

import { useState } from "react"
import { Download, FileJson, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface ExportDialogProps {
  data: any
  filename?: string
  trigger?: React.ReactNode
}

export function ExportDialog({ data, filename = "kinfin-data", trigger }: ExportDialogProps) {
  const [format, setFormat] = useState("json")
  const { toast } = useToast()

  const handleExport = () => {
    try {
      let content: string
      let mimeType: string
      let extension: string

      if (format === "json") {
        content = JSON.stringify(data, null, 2)
        mimeType = "application/json"
        extension = "json"
      } else if (format === "csv") {
        // Simple CSV conversion for flat data
        if (Array.isArray(data)) {
          const headers = Object.keys(data[0] || {}).join(",")
          const rows = data.map((item) =>
            Object.values(item)
              .map((value) => (typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value))
              .join(","),
          )
          content = [headers, ...rows].join("\n")
        } else {
          content = "Data structure not suitable for CSV export"
        }
        mimeType = "text/csv"
        extension = "csv"
      } else {
        // Plain text
        content = typeof data === "string" ? data : JSON.stringify(data, null, 2)
        mimeType = "text/plain"
        extension = "txt"
      }

      // Create a blob and download link
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${filename}.${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: `Data exported as ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your data",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>Choose a format to export your data</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="format" className="text-right text-sm font-medium">
              Format
            </label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center">
                    <FileJson className="mr-2 h-4 w-4" />
                    <span>JSON</span>
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>CSV</span>
                  </div>
                </SelectItem>
                <SelectItem value="txt">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Plain Text</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

