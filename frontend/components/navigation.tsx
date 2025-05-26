"use client"

import { usePathname, useRouter } from "next/navigation"
import { Search, History, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Search",
    href: "/",
    icon: Search,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  // Don't show navigation on video detail pages
  if (pathname.startsWith("/video/")) {
    return null
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-6 w-6" />
            <span className="font-bold text-lg">VideoSearch</span>
          </div>
          <div className="flex space-x-1 ml-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className={cn("flex items-center space-x-2", isActive && "bg-primary text-primary-foreground")}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
