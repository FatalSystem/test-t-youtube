import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { getHistoryAPI, clearHistoryAPI } from "../api"

export interface HistoryItem {
  query: string
  timestamp: string
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
  fetchHistory: () => Promise<void>
  clearHistory: () => Promise<void>
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

      fetchHistory: async () => {
        set({ isLoading: true, error: null }, false, "fetchHistory:start")

        try {
          const response = await getHistoryAPI()
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
          const errorMessage = error instanceof Error ? error.message : "Failed to load search history"
          set(
            {
              isLoading: false,
              error: errorMessage,
            },
            false,
            "fetchHistory:error",
          )
        }
      },

      clearHistory: async () => {
        set({ isLoading: true, error: null }, false, "clearHistory:start")

        try {
          await clearHistoryAPI()
          set(
            {
              history: [],
              isLoading: false,
              error: null,
            },
            false,
            "clearHistory:success",
          )
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to clear history"
          set(
            {
              isLoading: false,
              error: errorMessage,
            },
            false,
            "clearHistory:error",
          )
        }
      },
    }),
    {
      name: "history-store",
    },
  ),
)
