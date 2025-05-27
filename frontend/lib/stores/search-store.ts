import { create } from "zustand";
import { gql, useQuery, useMutation } from "@apollo/client";
import { client } from "../graphql/client";

export interface SearchResult {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  nextPageToken?: string;
  prevPageToken?: string;
}

// GraphQL Queries
const SEARCH_QUERY = gql`
  query Search($input: SearchInput!) {
    searchVideos(input: $input) {
      results {
        videoId
        title
        description
        thumbnailUrl
        publishedAt
      }
      totalResults
      nextPageToken
      prevPageToken
    }
  }
`;

const ADD_TO_HISTORY_MUTATION = gql`
  mutation AddToHistory($query: String!, $resultsCount: Float!) {
    addToHistory(query: $query, resultsCount: $resultsCount)
  }
`;

interface SearchState {
  // Search data
  query: string;
  allResults: SearchResult[];
  totalResults: number;
  nextPageToken?: string;
  hasMore: boolean;
  hasSearched: boolean;

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  // Actions
  setQuery: (query: string) => void;
  performSearch: (query: string, resetResults?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  setError: (error: string | null) => void;
  resetSearch: () => void;
  clearResults: () => void;
  handleVideoClick: (videoId: string) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
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
  setQuery: (query: string) => set({ query }),

  performSearch: async (query: string, resetResults = true) => {
    if (resetResults) {
      set({ isLoading: true, error: null, allResults: [], nextPageToken: undefined });
    } else {
      set({ isLoadingMore: true, error: null });
    }

    try {
      const { data } = await client.query({
        query: SEARCH_QUERY,
        variables: {
          input: {
            q: query,
            pageToken: resetResults ? undefined : get().nextPageToken,
          },
        },
      });

      const results = data.searchVideos.results;
      const totalResults = data.searchVideos.totalResults;
      const nextPageToken = data.searchVideos.nextPageToken;

      set((state) => ({
        query,
        allResults: resetResults ? results : [...state.allResults, ...results],
        totalResults,
        nextPageToken,
        hasMore: !!nextPageToken,
        hasSearched: true,
        isLoading: false,
        isLoadingMore: false,
        error: null,
      }));

      // Add to history after successful search
      await client.mutate({
        mutation: ADD_TO_HISTORY_MUTATION,
        variables: {
          query: query.trim(),
          resultsCount: results.length,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to perform search";
      set({
        isLoading: false,
        isLoadingMore: false,
        error: errorMessage,
      });
    }
  },

  loadMore: async () => {
    const { query, nextPageToken, isLoadingMore } = get();
    if (!nextPageToken || isLoadingMore) return;

    try {
      await get().performSearch(query, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load more results";
      set({
        isLoadingMore: false,
        error: errorMessage,
      });
    }
  },

  setError: (error: string | null) => set({ error }),

  resetSearch: () => {
    set({
      query: "",
      allResults: [],
      totalResults: 0,
      nextPageToken: undefined,
      hasMore: false,
      hasSearched: false,
      error: null,
    });
  },

  clearResults: () => {
    set({
      allResults: [],
      totalResults: 0,
      nextPageToken: undefined,
      hasMore: false,
    });
  },

  handleVideoClick: (videoId: string) => {
    window.location.href = `/video/${videoId}`;
  },
}));
