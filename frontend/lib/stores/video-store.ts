import { create } from "zustand"
import { devtools } from "zustand/middleware"

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

// Mock API function
const mockVideoAPI = async (videoId: string): Promise<VideoData> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const mockVideoDatabase: { [key: string]: VideoData } = {
    "1": {
      videoId: "dQw4w9WgXcQ",
      title: "Learn Next.js 15 - Complete Tutorial for Beginners",
      description: `In this comprehensive tutorial, you'll learn everything you need to know about Next.js 15, the latest version of the popular React framework.

🎯 What you'll learn:
• Next.js 15 new features and improvements
• App Router fundamentals
• Server Components vs Client Components
• Data fetching strategies
• Routing and navigation
• Styling with Tailwind CSS
• Deployment to Vercel

📚 Timestamps:
00:00 Introduction
02:30 Setting up Next.js 15
05:45 Understanding App Router
12:20 Server Components
18:30 Client Components
25:10 Data Fetching
32:45 Routing
40:15 Styling
48:30 Deployment

Perfect for beginners who want to master modern React development with Next.js!

🔗 Resources:
- Next.js Documentation: https://nextjs.org/docs
- GitHub Repository: https://github.com/example/nextjs-tutorial
- Tailwind CSS: https://tailwindcss.com

#NextJS #React #WebDevelopment #Tutorial`,
      thumbnailUrl: "/placeholder.svg?height=360&width=640",
      publishedAt: "2024-01-15T10:30:00Z",
      viewCount: 125847,
      likeCount: 8934,
      commentCount: 456,
    },
    "2": {
      videoId: "dQw4w9WgXcQ",
      title: "React Server Components Explained",
      description: `Deep dive into React Server Components and how they work in Next.js 15.

Learn the differences between Server and Client Components, when to use each, and best practices for building modern React applications.

🚀 Topics covered:
• What are Server Components?
• Server vs Client Components
• When to use each type
• Performance benefits
• Best practices
• Common pitfalls to avoid

This video is perfect for React developers who want to understand the latest paradigm in React development.`,
      thumbnailUrl: "/placeholder.svg?height=360&width=640",
      publishedAt: "2024-01-10T14:20:00Z",
      viewCount: 89234,
      likeCount: 5678,
      commentCount: 234,
    },
    "3": {
      videoId: "dQw4w9WgXcQ",
      title: "Tailwind CSS Tips and Tricks",
      description: `Learn advanced Tailwind CSS techniques to build beautiful interfaces faster.

✨ What's included:
• Advanced utility combinations
• Custom component patterns
• Responsive design strategies
• Dark mode implementation
• Performance optimization
• Plugin development

Take your Tailwind skills to the next level!`,
      thumbnailUrl: "/placeholder.svg?height=360&width=640",
      publishedAt: "2024-01-08T09:15:00Z",
      viewCount: 67890,
      likeCount: 4321,
      commentCount: 189,
    },
  }

  const videoData = mockVideoDatabase[videoId]
  if (!videoData) {
    throw new Error("Video not found")
  }

  return videoData
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
          const video = await mockVideoAPI(videoId)
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
          set(
            {
              isLoading: false,
              error: error instanceof Error ? error.message : "Failed to load video",
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
