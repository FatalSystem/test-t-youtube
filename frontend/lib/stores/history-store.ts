import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface HistoryItem {
  query: string
  timestamp: string
}

export interface HistoryResponse {
  history: HistoryItem[]
}

interface HistoryState {
  // Data
  history: HistoryItem[]

  // Loading states
  isLoading: boolean
  error: string | null

  // Actions
  setHistory: (history: HistoryItem[]) => void
  addHistoryItem: (item: HistoryItem) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearHistory: () => void
  fetchHistory: () => Promise<void>
}

// Mock API function
const mockHistoryAPI = async (): Promise<HistoryResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const localHistory = getLocalSearchHistory()
  const history: HistoryItem[] = localHistory.map((item) => ({
    query: item.query,
    timestamp: new Date(item.timestamp).toISOString(),
  }))

  return { history }
}

// Helper functions for localStorage
interface LocalSearchHistoryItem {
  id: string
  query: string
  timestamp: number
  resultsCount: number
}

const SEARCH_HISTORY_KEY = "video_search_history"

function getLocalSearchHistory(): LocalSearchHistoryItem[] {
  if (typeof window === "undefined") return []
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

export const useHistoryStore = create<HistoryState>()(
  devtools(
    (set, get) => ({
      // Initial state
      history: [],

      // Loading states
      isLoading: false,
      error: null,

      // Actions
      setHistory: (history: HistoryItem[]) => {
        set({ history, error: null }, false, "setHistory")
      },

      addHistoryItem: (item: HistoryItem) => {
        const currentHistory = get().history
        const filteredHistory = currentHistory.filter((h) => h.query.toLowerCase() !== item.query.toLowerCase())
        set(
          {
            history: [item, ...filteredHistory].slice(0, 50),
          },
          false,
          "addHistoryItem",
        )
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, "setLoading")
      },

      setError: (error: string | null) => {
        set({ error }, false, "setError")
      },

      clearHistory: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(SEARCH_HISTORY_KEY)
        }
        set({ history: [] }, false, "clearHistory")
      },

      fetchHistory: async () => {
        set({ isLoading: true, error: null }, false, "fetchHistory:start")

        try {
          const response = await mockHistoryAPI()
          set(
            {
              history: response.history,
              isLoading: false,
              error: null,
            },
            false,
            "fetchHistory:success",
          )
        } catch (error) {
          set(
            {
              isLoading: false,
              error: "Failed to load search history",
            },
            false,
            "fetchHistory:error",
          )
        }
      },
    }),
    {
      name: "history-store",
    },
  ),
)
