"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-dialog"
import { BarChart3, Database, FileText, Home, Layers, Network, Search, Settings, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search KinFin...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/clusters"))}>
              <Database className="mr-2 h-4 w-4" />
              <span>Clusters</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/taxonomy"))}>
              <Layers className="mr-2 h-4 w-4" />
              <span>Taxonomy</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/visualizations"))}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Visualizations</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/network"))}>
              <Network className="mr-2 h-4 w-4" />
              <span>Network</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Utilities">
            <CommandItem onSelect={() => runCommand(() => router.push("/docs"))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Documentation</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/export"))}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Export Data</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => runCommand(() => router.push("/clusters/CL_00001"))}>
              <Database className="mr-2 h-4 w-4" />
              <span>View Cluster CL_00001</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/clusters?taxonomicGroup=Bacteria"))}>
              <Search className="mr-2 h-4 w-4" />
              <span>Filter Bacteria Clusters</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

