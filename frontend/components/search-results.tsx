"use client";

import { Calendar, Play, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchStore } from "@/lib/stores/search-store";
import { formatDate } from "@/lib/utils";

export function SearchResults() {
  const { query, allResults, totalResults, isLoadingMore, hasMore, loadMore, handleVideoClick } = useSearchStore();

  return (
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

      {/* No Results */}
      {allResults.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground">Try searching with different keywords</p>
        </div>
      )}
    </div>
  );
}
