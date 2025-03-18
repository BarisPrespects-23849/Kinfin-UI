"use client"

import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CommandMenu } from "@/components/command-menu"
import { useMobile } from "@/hooks/use-mobile"

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: {
    name: string
    href: string
    current?: boolean
  }[]
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  const isMobile = useMobile()

  return (
    <div className="flex flex-col gap-4 pb-4 sm:pb-6">
      {breadcrumbs && breadcrumbs.length > 0 && !isMobile && (
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.href}>
                <BreadcrumbItem>
                  {breadcrumb.current ? (
                    <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm sm:text-base text-muted-foreground">{description}</p>}
        </div>
        <div className="hidden md:flex items-center gap-2">
          <CommandMenu />
        </div>
      </div>
    </div>
  )
}

