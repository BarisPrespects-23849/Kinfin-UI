"use client"

import type React from "react"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ComparisonDialogProps {
  trigger?: React.ReactNode
}

export function ComparisonDialog({ trigger }: ComparisonDialogProps) {
  const [clusterIds, setClusterIds] = useState<string[]>(["", ""])
  const { toast } = useToast()
  const router = useRouter()

  const handleAddCluster = () => {
    if (clusterIds.length < 5) {
      setClusterIds([...clusterIds, ""])
    } else {
      toast({
        title: "Maximum clusters reached",
        description: "You can compare up to 5 clusters at once",
        variant: "destructive",
      })
    }
  }

  const handleRemoveCluster = (index: number) => {
    if (clusterIds.length > 2) {
      const newIds = [...clusterIds]
      newIds.splice(index, 1)
      setClusterIds(newIds)
    }
  }

  const handleClusterIdChange = (index: number, value: string) => {
    const newIds = [...clusterIds]
    newIds[index] = value
    setClusterIds(newIds)
  }

  const handleCompare = () => {
    // Validate cluster IDs
    const validIds = clusterIds.filter((id) => id.trim() !== "")

    if (validIds.length < 2) {
      toast({
        title: "Invalid selection",
        description: "Please enter at least two cluster IDs to compare",
        variant: "destructive",
      })
      return
    }

    // Navigate to comparison page with query params
    const queryString = validIds.map((id) => `id=${encodeURIComponent(id)}`).join("&")
    router.push(`/clusters/compare?${queryString}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Compare Clusters</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compare Clusters</DialogTitle>
          <DialogDescription>Enter the IDs of the clusters you want to compare</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {clusterIds.map((id, index) => (
            <div key={index} className="flex items-center gap-2">
              <Label htmlFor={`cluster-${index}`} className="w-24 text-right">
                Cluster {index + 1}
              </Label>
              <Input
                id={`cluster-${index}`}
                value={id}
                onChange={(e) => handleClusterIdChange(index, e.target.value)}
                placeholder="e.g. CL_00001"
                className="flex-1"
              />
              {index > 1 && (
                <Button variant="ghost" size="sm" onClick={() => handleRemoveCluster(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={handleAddCluster} disabled={clusterIds.length >= 5} className="mt-2">
            Add Another Cluster
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={handleCompare}>Compare Clusters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

