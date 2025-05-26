import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface AnalyticsItem {
  query: string
  count: number
}

export interface AnalyticsResponse {
  analytics: AnalyticsItem[]
}

interface AnalyticsState {
  // Data
  analytics: AnalyticsItem[]
  totalSearches: number
  uniqueQueries: number

  // Loading states
  isLoading: boolean
  error: string | null

  // Actions
  setAnalytics: (analytics: AnalyticsItem[]) => void
  setTotalSearches: (total: number) => void
  setUniqueQueries: (unique: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearAnalytics: () => void
  fetchAnalytics: () => Promise<void>
}

// Mock API functions
const mockAnalyticsAPI = async (): Promise<AnalyticsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const localAnalytics = getLocalSearchAnalytics()
  const analytics: AnalyticsItem[] = localAnalytics.map((item) => ({
    query: item.query,
    count: item.count,
  }))

  return { analytics }
}

// Helper functions for localStorage
interface LocalSearchAnalytics {
  query: string
  count: number
  lastSearched: number
}

const SEARCH_ANALYTICS_KEY = "video_search_analytics"

function getLocalSearchAnalytics(): LocalSearchAnalytics[] {
  if (typeof window === "undefined") return []
  try {
    const analytics = localStorage.getItem(SEARCH_ANALYTICS_KEY)
    return analytics ? JSON.parse(analytics) : []
  } catch {
    return []
  }
}

export const useAnalyticsStore = create<AnalyticsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      analytics: [],
      totalSearches: 0,
      uniqueQueries: 0,

      // Loading states
      isLoading: false,
      error: null,

      // Actions
      setAnalytics: (analytics: AnalyticsItem[]) => {
        set(
          {
            analytics,
            uniqueQueries: analytics.length,
            error: null,
          },
          false,
          "setAnalytics",
        )
      },

      setTotalSearches: (total: number) => {
        set({ totalSearches: total }, false, "setTotalSearches")
      },

      setUniqueQueries: (unique: number) => {
        set({ uniqueQueries: unique }, false, "setUniqueQueries")
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, "setLoading")
      },

      setError: (error: string | null) => {
        set({ error }, false, "setError")
      },

      clearAnalytics: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(SEARCH_ANALYTICS_KEY)
        }
        set(
          {
            analytics: [],
            totalSearches: 0,
            uniqueQueries: 0,
          },
          false,
          "clearAnalytics",
        )
      },

      fetchAnalytics: async () => {
        set({ isLoading: true, error: null }, false, "fetchAnalytics:start")

        try {
          const [analyticsResponse, historyResponse] = await Promise.all([
            mockAnalyticsAPI(),
            // Import and use history API
            import("./history-store").then((m) => {
              const mockHistoryAPI = async () => {
                const localHistory = getLocalSearchHistory()
                return {
                  history: localHistory.map((item) => ({
                    query: item.query,
                    timestamp: new Date(item.timestamp).toISOString(),
                  })),
                }
              }
              return mockHistoryAPI()
            }),
          ])

          const totalSearchCount = analyticsResponse.analytics.reduce((sum, item) => sum + item.count, 0)

          set(
            {
              analytics: analyticsResponse.analytics,
              totalSearches: Array.isArray(historyResponse)
                ? historyResponse.length
                : historyResponse.history?.length || 0,
              uniqueQueries: analyticsResponse.analytics.length,
              isLoading: false,
              error: null,
            },
            false,
            "fetchAnalytics:success",
          )
        } catch (error) {
          set(
            {
              isLoading: false,
              error: "Failed to load analytics data",
            },
            false,
            "fetchAnalytics:error",
          )
        }
      },
    }),
    {
      name: "analytics-store",
    },
  ),
)

// Helper function for history (duplicated to avoid circular imports)
interface LocalSearchHistoryItem {
  id: string
  query: string
  timestamp: number
  resultsCount: number
}

function getLocalSearchHistory(): LocalSearchHistoryItem[] {
  if (typeof window === "undefined") return []
  try {
    const history = localStorage.getItem("video_search_history")
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}
