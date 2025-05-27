import { useEffect } from "react";
import { useHistoryStore } from "@/lib/stores/history-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function HistoryDisplay() {
  const { history, isLoading, error, fetchHistory, clearHistory } = useHistoryStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (isLoading) {
    return <div>Loading history...</div>;
  }

  if (error) {
    return <div>Error loading history: {error}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Search History</CardTitle>
        <Button variant="destructive" size="sm" onClick={clearHistory}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground">No search history yet</div>
          ) : (
            history.map((item) => (
              <div key={`${item.query}-${item.timestamp}`} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{item.query}</div>
                  <div className="text-sm text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
