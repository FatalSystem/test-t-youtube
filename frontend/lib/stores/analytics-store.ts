import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { getAnalyticsAPI, clearAnalyticsAPI, getHistoryAPI } from "../api"

export interface AnalyticsItem {
  query: string
  count: number
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
  fetchAnalytics: () => Promise<void>
  clearAnalytics: () => Promise<void>
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

      fetchAnalytics: async () => {
        set({ isLoading: true, error: null }, false, "fetchAnalytics:start")

        try {
          const [analyticsResponse, historyResponse] = await Promise.all([getAnalyticsAPI(), getHistoryAPI()])

          set(
            {
              analytics: analyticsResponse.analytics,
              totalSearches: historyResponse.history.length,
              uniqueQueries: analyticsResponse.analytics.length,
              isLoading: false,
              error: null,
            },
            false,
            "fetchAnalytics:success",
          )
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load analytics data"
          set(
            {
              isLoading: false,
              error: errorMessage,
            },
            false,
            "fetchAnalytics:error",
          )
        }
      },

      clearAnalytics: async () => {
        set({ isLoading: true, error: null }, false, "clearAnalytics:start")

        try {
          await clearAnalyticsAPI()
          set(
            {
              analytics: [],
              totalSearches: 0,
              uniqueQueries: 0,
              isLoading: false,
              error: null,
            },
            false,
            "clearAnalytics:success",
          )
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to clear analytics"
          set(
            {
              isLoading: false,
              error: errorMessage,
            },
            false,
            "clearAnalytics:error",
          )
        }
      },
    }),
    {
      name: "analytics-store",
    },
  ),
)
