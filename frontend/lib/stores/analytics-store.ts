import { create } from "zustand";
import { client } from "../graphql/client";
import { GET_ANALYTICS_QUERY } from "../graphql/queries";

export interface AnalyticsItem {
  query: string;
  count: number;
}

interface AnalyticsState {
  // Data
  analytics: AnalyticsItem[];
  totalSearches: number;
  uniqueQueries: number;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setAnalytics: (analytics: AnalyticsItem[]) => void;
  setTotalSearches: (total: number) => void;
  setUniqueQueries: (unique: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // Initial state
  analytics: [],
  totalSearches: 0,
  uniqueQueries: 0,

  // Loading states
  isLoading: false,
  error: null,

  // Actions
  setAnalytics: (analytics: AnalyticsItem[]) => {
    set({
      analytics,
      uniqueQueries: analytics.length,
      error: null,
    });
  },

  setTotalSearches: (total: number) => {
    set({ totalSearches: total });
  },

  setUniqueQueries: (unique: number) => {
    set({ uniqueQueries: unique });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await client.query({
        query: GET_ANALYTICS_QUERY,
      });

      const analytics = data.analytics.analytics;
      const totalSearches = analytics.reduce((sum: number, item: AnalyticsItem) => sum + item.count, 0);

      set({
        analytics,
        totalSearches,
        uniqueQueries: analytics.length,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load analytics data";
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },
}));
