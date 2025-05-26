import { create } from "zustand"
import { devtools } from "zustand/middleware"

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
  setSearchResults: (response: SearchResponse, resetResults?: boolean) => void
  appendSearchResults: (response: SearchResponse) => void
  setLoading: (loading: boolean) => void
  setLoadingMore: (loading: boolean) => void
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

      setSearchResults: (response: SearchResponse, resetResults = true) => {
        if (resetResults) {
          set(
            {
              allResults: response.results,
              totalResults: response.totalResults,
              nextPageToken: response.nextPageToken,
              hasMore: !!response.nextPageToken,
              hasSearched: true,
              error: null,
            },
            false,
            "setSearchResults",
          )
        } else {
          const currentResults = get().allResults
          set(
            {
              allResults: [...currentResults, ...response.results],
              nextPageToken: response.nextPageToken,
              hasMore: !!response.nextPageToken,
              error: null,
            },
            false,
            "appendSearchResults",
          )
        }
      },

      appendSearchResults: (response: SearchResponse) => {
        const currentResults = get().allResults
        set(
          {
            allResults: [...currentResults, ...response.results],
            nextPageToken: response.nextPageToken,
            hasMore: !!response.nextPageToken,
          },
          false,
          "appendSearchResults",
        )
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, "setLoading")
      },

      setLoadingMore: (loading: boolean) => {
        set({ isLoadingMore: loading }, false, "setLoadingMore")
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
