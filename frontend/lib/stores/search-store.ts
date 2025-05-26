import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { searchAPI, addSearchToHistory } from "../api"

export interface SearchResult {
  videoId: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
}

export interface SearchResponse {
  results: SearchResult[]
  totalResults: number
  nextPageToken?: string
  prevPageToken?: string
}

interface SearchState {
  // Search data
  query: string
  allResults: SearchResult[]
  totalResults: number
  nextPageToken?: string
  hasMore: boolean
  hasSearched: boolean

  // Loading states
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null

  // Actions
  setQuery: (query: string) => void
  performSearch: (query: string, resetResults?: boolean) => Promise<void>
  loadMore: () => Promise<void>
  setError: (error: string | null) => void
  resetSearch: () => void
  clearResults: () => void
}

export const useSearchStore = create<SearchState>()(
  devtools(
    (set, get) => ({
      // Initial state
      query: "",
      allResults: [],
      totalResults: 0,
      nextPageToken: undefined,
      hasMore: false,
      hasSearched: false,

      // Loading states
      isLoading: false,
      isLoadingMore: false,
      error: null,

      // Actions
      setQuery: (query: string) => {
        set({ query }, false, "setQuery")
      },

      performSearch: async (searchQuery: string, resetResults = true) => {
        const state = get()

        if (!searchQuery.trim()) return

        if (resetResults) {
          set({ isLoading: true, error: null }, false, "performSearch:start")
        } else {
          set({ isLoadingMore: true, error: null }, false, "performSearch:loadMore")
        }

        try {
          const response = await searchAPI(searchQuery, resetResults ? undefined : state.nextPageToken, 10)

          if (resetResults) {
            set(
              {
                query: searchQuery,
                allResults: response.results,
                totalResults: response.totalResults,
                nextPageToken: response.nextPageToken,
                hasMore: !!response.nextPageToken,
                hasSearched: true,
                isLoading: false,
                error: null,
              },
              false,
              "performSearch:success",
            )

            // Add to history
            await addSearchToHistory(searchQuery, response.totalResults)
          } else {
            set(
              {
                allResults: [...state.allResults, ...response.results],
                nextPageToken: response.nextPageToken,
                hasMore: !!response.nextPageToken,
                isLoadingMore: false,
                error: null,
              },
              false,
              "performSearch:loadMoreSuccess",
            )
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Search failed. Please try again."

          set(
            {
              isLoading: false,
              isLoadingMore: false,
              error: errorMessage,
            },
            false,
            "performSearch:error",
          )
        }
      },

      loadMore: async () => {
        const state = get()
        if (!state.hasMore || state.isLoadingMore || !state.nextPageToken) return

        await state.performSearch(state.query, false)
      },

      setError: (error: string | null) => {
        set({ error }, false, "setError")
      },

      resetSearch: () => {
        set(
          {
            query: "",
            allResults: [],
            totalResults: 0,
            nextPageToken: undefined,
            hasMore: false,
            hasSearched: false,
            isLoading: false,
            isLoadingMore: false,
            error: null,
          },
          false,
          "resetSearch",
        )
      },

      clearResults: () => {
        set(
          {
            allResults: [],
            totalResults: 0,
            nextPageToken: undefined,
            hasMore: false,
            hasSearched: false,
          },
          false,
          "clearResults",
        )
      },
    }),
    {
      name: "search-store",
    },
  ),
)
