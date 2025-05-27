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
  mutation AddToHistory($query: String!, $resultsCount: Int!) {
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
  setQuery: (query: string) => {
    set({ query });
  },

  performSearch: async (searchQuery: string, resetResults = true) => {
    const state = get();

    if (!searchQuery.trim()) return;

    if (resetResults) {
      set({ isLoading: true, error: null });
    } else {
      set({ isLoadingMore: true, error: null });
    }

    try {
      const { data } = await client.query({
        query: SEARCH_QUERY,
        variables: {
          input: {
            q: searchQuery,
            pageToken: resetResults ? undefined : state.nextPageToken,
            maxResults: "10",
          },
        },
      });

      if (resetResults) {
        set({
          query: searchQuery,
          allResults: data.searchVideos.results,
          totalResults: data.searchVideos.totalResults,
          nextPageToken: data.searchVideos.nextPageToken,
          hasMore: !!data.searchVideos.nextPageToken,
          hasSearched: true,
          isLoading: false,
          error: null,
        });

        // Add to history
        await client.mutate({
          mutation: ADD_TO_HISTORY_MUTATION,
          variables: {
            query: searchQuery,
            resultsCount: data.searchVideos.totalResults,
          },
        });
      } else {
        set({
          allResults: [...state.allResults, ...data.searchVideos.results],
          nextPageToken: data.searchVideos.nextPageToken,
          hasMore: !!data.searchVideos.nextPageToken,
          isLoadingMore: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Search failed. Please try again.";

      set({
        isLoading: false,
        isLoadingMore: false,
        error: errorMessage,
      });
    }
  },

  loadMore: async () => {
    const state = get();
    if (!state.hasMore || state.isLoadingMore || !state.nextPageToken) return;

    await state.performSearch(state.query, false);
  },

  setError: (error: string | null) => {
    set({ error });
  },

  resetSearch: () => {
    set({
      query: "",
      allResults: [],
      totalResults: 0,
      nextPageToken: undefined,
      hasMore: false,
      hasSearched: false,
      isLoading: false,
      isLoadingMore: false,
      error: null,
    });
  },

  clearResults: () => {
    set({
      allResults: [],
      totalResults: 0,
      nextPageToken: undefined,
      hasMore: false,
      hasSearched: false,
    });
  },

  handleVideoClick: (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  },
}));
