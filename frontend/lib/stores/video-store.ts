import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { getVideoAPI } from "../api"

export interface VideoData {
  videoId: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
}

interface VideoState {
  // Data
  currentVideo: VideoData | null

  // Loading states
  isLoading: boolean
  error: string | null

  // Actions
  setVideo: (video: VideoData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearVideo: () => void
  fetchVideo: (videoId: string) => Promise<void>
}

export const useVideoStore = create<VideoState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentVideo: null,

      // Loading states
      isLoading: false,
      error: null,

      // Actions
      setVideo: (video: VideoData) => {
        set({ currentVideo: video, error: null }, false, "setVideo")
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, "setLoading")
      },

      setError: (error: string | null) => {
        set({ error }, false, "setError")
      },

      clearVideo: () => {
        set(
          {
            currentVideo: null,
            error: null,
          },
          false,
          "clearVideo",
        )
      },

      fetchVideo: async (videoId: string) => {
        set({ isLoading: true, error: null }, false, "fetchVideo:start")

        try {
          const video = await getVideoAPI(videoId)
          set(
            {
              currentVideo: video,
              isLoading: false,
              error: null,
            },
            false,
            "fetchVideo:success",
          )
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load video"
          set(
            {
              isLoading: false,
              error: errorMessage,
            },
            false,
            "fetchVideo:error",
          )
        }
      },
    }),
    {
      name: "video-store",
    },
  ),
)
