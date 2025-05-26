"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Search, TrendingUp, Trash2, RefreshCw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAnalyticsStore } from "@/lib/stores/analytics-store"

export default function AnalyticsPage() {
  const router = useRouter()
  const { analytics, totalSearches, uniqueQueries, isLoading, error, fetchAnalytics, clearAnalytics } =
    useAnalyticsStore()

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const handleSearchClick = (query: string) => {
    router.push(`/?q=${encodeURIComponent(query)}`)
  }

  const handleClearAnalytics = async () => {
    clearAnalytics()
    await fetchAnalytics()
  }

  const getPopularityPercentage = (count: number) => {
    if (analytics.length === 0) return 0
    const maxCount = Math.max(...analytics.map((item) => item.count))
    return (count / maxCount) * 100
  }

  const getTopSearches = () => analytics.slice(0, 10)

  const getTotalSearchCount = () => {
    return analytics.reduce((total, item) => total + item.count, 0)
  }

  const getAverageSearchCount = () => {
    if (analytics.length === 0) return 0
    return (getTotalSearchCount() / analytics.length).toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading analytics</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchAnalytics} className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const topSearches = getTopSearches()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Search Analytics</h1>
              <p className="text-muted-foreground">Insights into your search patterns and trends</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={fetchAnalytics} size="sm" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            {analytics.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAnalytics}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Analytics</span>
              </Button>
            )}
          </div>
        </div>

        {analytics.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No analytics data</h3>
            <p className="text-muted-foreground mb-4">Start searching to see analytics and trends</p>
            <Button onClick={() => router.push("/")} className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Start Searching</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getTotalSearchCount()}</div>
                  <p className="text-xs text-muted-foreground">All searches performed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Queries</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{uniqueQueries}</div>
                  <p className="text-xs text-muted-foreground">Different search terms</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{topSearches[0]?.count || 0}</div>
                  <p className="text-xs text-muted-foreground truncate">{topSearches[0]?.query || "No searches yet"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Count</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getAverageSearchCount()}</div>
                  <p className="text-xs text-muted-foreground">Searches per query</p>
                </CardContent>
              </Card>
            </div>

            {/* Popular Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Most Popular Searches</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topSearches.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No search data available</p>
                ) : (
                  topSearches.map((item, index) => (
                    <div
                      key={`${item.query}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleSearchClick(item.query)}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <Badge
                          variant={index < 3 ? "default" : "outline"}
                          className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
                        >
                          {index + 1}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium">{item.query}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={getPopularityPercentage(item.count)} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground min-w-fit">
                              {item.count} search{item.count !== 1 ? "es" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        Search
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
