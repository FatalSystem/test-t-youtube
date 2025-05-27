import { useEffect } from "react";
import { useAnalyticsStore } from "@/lib/stores/analytics-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function AnalyticsDisplay() {
  const { analytics, totalSearches, uniqueQueries, isLoading, error, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div>Error loading analytics: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSearches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unique Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueQueries}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.map((item) => (
              <div key={item.query} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.query}</span>
                  <span>{item.count} searches</span>
                </div>
                <Progress value={(item.count / totalSearches) * 100} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
