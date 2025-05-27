"use client";

import { useState } from "react";
import { History, BarChart3, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { SearchResults } from "@/components/search-results";
import { AnalyticsDisplay } from "@/components/analytics-display";
import { HistoryDisplay } from "@/components/history-display";
import { useSearchStore } from "@/lib/stores/search-store";

type View = "search" | "analytics" | "history";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("search");
  const { hasSearched } = useSearchStore();

  const renderContent = () => {
    switch (currentView) {
      case "analytics":
        return <AnalyticsDisplay />;
      case "history":
        return <HistoryDisplay onViewChange={setCurrentView} />;
      default:
        return (
          <>
            <SearchBar />
            {hasSearched ? (
              <SearchResults />
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Write something to find</h3>
                <p className="text-muted-foreground">Enter a search term to find videos</p>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {currentView !== "search" && (
            <Button variant="ghost" size="sm" onClick={() => setCurrentView("search")} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          )}
          <h1 className="text-2xl font-bold">
            {currentView === "analytics" ? "Analytics" : currentView === "history" ? "Search History" : "Video Search"}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={currentView === "analytics" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentView("analytics")}
            className="flex items-center"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant={currentView === "history" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentView("history")}
            className="flex items-center"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </div>
      {renderContent()}
    </main>
  );
}
