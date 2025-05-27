import { create } from "zustand";
import { gql } from "@apollo/client";
import { client } from "../graphql/client";

export interface VideoData {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

const GET_VIDEO_QUERY = gql`
  query GetVideo($id: String!) {
    video(id: $id) {
      videoId
      title
      description
      thumbnailUrl
      publishedAt
      viewCount
      likeCount
      commentCount
    }
  }
`;

interface VideoState {
  // Data
  currentVideo: VideoData | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setVideo: (video: VideoData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearVideo: () => void;
  fetchVideo: (videoId: string) => Promise<void>;
}

export const useVideoStore = create<VideoState>()((set) => ({
  // Initial state
  currentVideo: null,

  // Loading states
  isLoading: true,
  error: null,

  // Actions
  setVideo: (video: VideoData) => {
    set({ currentVideo: video, error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearVideo: () => {
    set({
      currentVideo: null,
      error: null,
    });
  },

  fetchVideo: async (videoId: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await client.query({
        query: GET_VIDEO_QUERY,
        variables: { id: videoId },
      });

      set({
        currentVideo: data.video,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load video";
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },
}));
