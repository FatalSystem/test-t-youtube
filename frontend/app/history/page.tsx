"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { History, Search, Clock, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useHistoryStore } from "@/lib/stores/history-store"
import { ApiStatus } from "@/components/api-status"

export default function HistoryPage() {
  const router = useRouter()
  const { history, isLoading, error, fetchHistory, clearHistory } = useHistoryStore()

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24)
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const handleSearchClick = (query: string) => {
    router.push(`/?q=${encodeURIComponent(query)}`)
  }

  const handleClearHistory = async () => {
    await clearHistory()
  }

  const groupHistoryByDate = (history: typeof useHistoryStore.getState.history) => {
    const groups: { [key: string]: typeof history } = {}

    history.forEach((item) => {
      const date = new Date(item.timestamp)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let groupKey: string
      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today"
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday"
      } else {
        groupKey = date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(item)
    })

    return groups
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ApiStatus />
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ApiStatus />
          <div className="text-center py-12">
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading history</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchHistory} className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const groupedHistory = groupHistoryByDate(history)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ApiStatus />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <History className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Search History</h1>
              <p className="text-muted-foreground">
                {history.length} search{history.length !== 1 ? "es" : ""} saved
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={fetchHistory} size="sm" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            {history.length > 0 && (
              <Button variant="outline" onClick={handleClearHistory} size="sm" className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Clear History</span>
              </Button>
            )}
          </div>
        </div>

        {/* History Content */}
        {history.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No search history</h3>
            <p className="text-muted-foreground mb-4">
              Your search history will appear here after you perform searches
            </p>
            <Button onClick={() => router.push("/")} className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Start Searching</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedHistory).map(([dateGroup, items]) => (
              <div key={dateGroup}>
                <h2 className="text-lg font-semibold mb-3 text-muted-foreground">{dateGroup}</h2>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <Card
                      key={`${item.query}-${item.timestamp}-${index}`}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSearchClick(item.query)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{item.query}</p>
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(item.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="ml-4">
                            Search Again
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
