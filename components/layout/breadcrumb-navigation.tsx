"use client"

import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
  className?: string
}

export function BreadcrumbNavigation({ items, className }: BreadcrumbNavigationProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {/* Home Icon */}
      <a href="/" className="flex items-center text-gray-500 hover:text-[#22D3A6] transition-colors">
        <Home className="h-4 w-4" />
      </a>

      {/* Breadcrumb items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
          {item.href && !item.active ? (
            <a
              href={item.href}
              className="text-gray-500 hover:text-[#22D3A6] transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className={cn(item.active ? "text-gray-900 font-medium" : "text-gray-500")}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
