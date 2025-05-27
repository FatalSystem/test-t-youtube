import { useEffect } from "react";
import { useHistoryStore } from "@/lib/stores/history-store";
import { useSearchStore } from "@/lib/stores/search-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Search, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface HistoryDisplayProps {
  onViewChange: (view: "search" | "analytics" | "history") => void;
}

export function HistoryDisplay({ onViewChange }: HistoryDisplayProps) {
  const { history, isLoading, error, fetchHistory, clearHistory } = useHistoryStore();
  const { setQuery, performSearch } = useSearchStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleHistoryClick = (query: string) => {
    setQuery(query);
    performSearch(query, true);
    onViewChange("search");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-5 w-5 animate-spin" />
          Loading history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>Error loading history: {error}</p>
            <Button variant="outline" size="sm" onClick={fetchHistory} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Search History</CardTitle>
        {history.length > 0 && (
          <Button variant="destructive" size="sm" onClick={clearHistory}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No search history yet</p>
              <p className="text-sm text-muted-foreground mt-2">Your search history will appear here</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {history.map((item) => (
                <div
                  key={`${item.query}-${item.timestamp}`}
                  className="group flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleHistoryClick(item.query)}
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">{item.query}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(item.timestamp)}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHistoryClick(item.query);
                    }}
                  >
                    Search Again
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
