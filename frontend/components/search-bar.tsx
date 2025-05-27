"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/lib/stores/search-store";

export function SearchBar() {
  const { query, setQuery, isLoading, performSearch } = useSearchStore();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      performSearch(query, true);
    }
  };

  return (
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
        onClick={() => performSearch(query, true)}
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
  );
}
