"use client"

import type React from "react"
import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, Play, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSearchStore } from "@/lib/stores/search-store"
import { mockSearchAPI, addSearchToHistory } from "@/lib/api"

export default function SearchPage() {
  const router = useRouter()
  const {
    query,
    allResults,
    totalResults,
    nextPageToken,
    hasMore,
    hasSearched,
    isLoading,
    isLoadingMore,
    error,
    setQuery,
    setSearchResults,
    setLoading,
    setLoadingMore,
    setError,
  } = useSearchStore()

  const handleSearch = async (newQuery?: string, resetResults = true) => {
    const searchQuery = newQuery || query
    if (!searchQuery.trim()) return

    if (resetResults) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const response = await mockSearchAPI(searchQuery, resetResults ? undefined : nextPageToken, 10)

      setSearchResults(response, resetResults)

      if (resetResults) {
        addSearchToHistory(searchQuery, response.totalResults)
      }
    } catch (err) {
      setError("Search failed. Please try again.")
      console.error("Search failed:", err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && nextPageToken) {
      handleSearch(query, false)
    }
  }, [isLoadingMore, hasMore, nextPageToken, query])

  // Infinite scroll implementation
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore()
      }
    }

    if (hasMore && !isLoadingMore) {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [hasMore, isLoadingMore, loadMore])

  // Handle URL query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const queryParam = urlParams.get("q")
    if (queryParam && queryParam !== query) {
      setQuery(queryParam)
      handleSearch(queryParam, true)
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleVideoClick = (videoId: string) => {
    router.push(`/video/${videoId}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query, true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Video Search</h1>

          {/* Search Input */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for videos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4 py-2 text-base"
            />
            <Button
              onClick={() => handleSearch(query, true)}
              disabled={!query.trim() || isLoading}
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setError(null)
                handleSearch(query, true)
              }}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Search Results for "{query}"</h2>
              <p className="text-muted-foreground">
                {allResults.length} of {totalResults.toLocaleString()} results
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allResults.map((item, index) => (
                <Card
                  key={`${item.videoId}-${index}`}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleVideoClick(item.videoId)}
                >
                  <div className="relative">
                    <img
                      src={item.thumbnailUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(item.publishedAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Loading More Indicator */}
            {isLoadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading more videos...
                </div>
              </div>
            )}

            {/* Load More Button */}
            {hasMore && !isLoadingMore && (
              <div className="flex justify-center py-8">
                <Button onClick={loadMore} variant="outline" disabled={isLoadingMore}>
                  Load More Videos
                </Button>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && allResults.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You've reached the end of the search results</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start searching</h3>
            <p className="text-muted-foreground">Enter a search term to find videos</p>
          </div>
        )}

        {/* No Results */}
        {hasSearched && allResults.length === 0 && !isLoading && !error && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  )
}
