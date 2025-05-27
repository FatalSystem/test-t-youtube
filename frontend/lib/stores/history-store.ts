import { create } from "zustand";
import { client } from "../graphql/client";
import { GET_HISTORY_QUERY, CLEAR_HISTORY_MUTATION } from "../graphql/queries";

export interface HistoryItem {
  query: string;
  timestamp: string;
}

interface HistoryState {
  // Data
  history: HistoryItem[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setHistory: (history: HistoryItem[]) => void;
  addHistoryItem: (item: HistoryItem) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  // Initial state
  history: [],

  // Loading states
  isLoading: false,
  error: null,

  // Actions
  setHistory: (history: HistoryItem[]) => {
    set({ history, error: null });
  },

  addHistoryItem: (item: HistoryItem) => {
    const currentHistory = get().history;
    const filteredHistory = currentHistory.filter((h) => h.query.toLowerCase() !== item.query.toLowerCase());
    set({
      history: [item, ...filteredHistory].slice(0, 50),
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  fetchHistory: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await client.query({
        query: GET_HISTORY_QUERY,
      });

      set({
        history: data.history,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load search history";
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  clearHistory: async () => {
    set({ isLoading: true, error: null });

    try {
      await client.mutate({
        mutation: CLEAR_HISTORY_MUTATION,
      });

      set({
        history: [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to clear history";
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },
}));
