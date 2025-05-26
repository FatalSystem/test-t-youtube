// Mock API functions to simulate the endpoints

import { useHistoryStore } from "./stores/history-store"
import { useAnalyticsStore } from "./stores/analytics-store"

export interface HistoryItem {
  query: string
  timestamp: string
}

export interface AnalyticsItem {
  query: string
  count: number
}

export interface HistoryResponse {
  history: HistoryItem[]
}

export interface AnalyticsResponse {
  analytics: AnalyticsItem[]
}

// Mock API function for GET /history
export const mockHistoryAPI = async (): Promise<HistoryResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get history from localStorage and convert to API format
  const localHistory = getLocalSearchHistory()

  const history: HistoryItem[] = localHistory.map((item) => ({
    query: item.query,
    timestamp: new Date(item.timestamp).toISOString(),
  }))

  return { history }
}

// Mock API function for GET /analytics
export const mockAnalyticsAPI = async (): Promise<AnalyticsResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Get analytics from localStorage and convert to API format
  const localAnalytics = getLocalSearchAnalytics()

  const analytics: AnalyticsItem[] = localAnalytics.map((item) => ({
    query: item.query,
    count: item.count,
  }))

  return { analytics }
}

// Helper function to add search to history and analytics
export function addSearchToHistory(query: string, resultsCount: number) {
  if (typeof window === "undefined") return

  // Add to localStorage for persistence
  const historyItem = {
    id: Date.now().toString(),
    query: query.trim(),
    timestamp: Date.now(),
    resultsCount,
  }

  // Get existing history
  const existingHistory = getLocalSearchHistory()
  const filteredHistory = existingHistory.filter((item) => item.query.toLowerCase() !== query.toLowerCase())
  const newHistory = [historyItem, ...filteredHistory].slice(0, 50)
  localStorage.setItem("video_search_history", JSON.stringify(newHistory))

  // Update analytics
  updateLocalSearchAnalytics(query)

  // Update Zustand stores
  const historyStore = useHistoryStore.getState()
  const analyticsStore = useAnalyticsStore.getState()

  historyStore.addHistoryItem({
    query: query.trim(),
    timestamp: new Date().toISOString(),
  })

  // Refresh analytics data
  analyticsStore.fetchAnalytics()
}

// Mock API function for search
export const mockSearchAPI = async (query: string, pageToken?: string, maxResults = 10) => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const pageNumber = pageToken ? Number.parseInt(pageToken.replace("PAGE_", "")) : 1
  const startIndex = (pageNumber - 1) * maxResults

  const mockResults = Array.from({ length: maxResults }, (_, index) => ({
    videoId: `${startIndex + index + 1}`,
    title: `${query} - Video ${startIndex + index + 1}: Advanced Tutorial`,
    description: `This is a comprehensive tutorial about ${query}. Learn everything you need to know with practical examples and real-world applications. Perfect for beginners and advanced users alike.`,
    thumbnailUrl: `/placeholder.svg?height=180&width=320&text=Video+${startIndex + index + 1}`,
    publishedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  return {
    results: mockResults,
    totalResults: 10000000,
    nextPageToken: pageNumber < 50 ? `PAGE_${pageNumber + 1}` : undefined,
    prevPageToken: pageNumber > 1 ? `PAGE_${pageNumber - 1}` : undefined,
  }
}

// Helper functions to interact with localStorage (keeping existing functionality)
interface LocalSearchHistoryItem {
  id: string
  query: string
  timestamp: number
  resultsCount: number
}

interface LocalSearchAnalytics {
  query: string
  count: number
  lastSearched: number
}

const SEARCH_HISTORY_KEY = "video_search_history"
const SEARCH_ANALYTICS_KEY = "video_search_analytics"

function getLocalSearchHistory(): LocalSearchHistoryItem[] {
  if (typeof window === "undefined") return []
  try {
    const history = localStorage.getItem("video_search_history")
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

function updateLocalSearchAnalytics(query: string) {
  if (typeof window === "undefined") return

  const analytics = getLocalSearchAnalytics()
  const normalizedQuery = query.toLowerCase().trim()

  const existingIndex = analytics.findIndex((item) => item.query.toLowerCase() === normalizedQuery)

  if (existingIndex >= 0) {
    analytics[existingIndex].count += 1
    analytics[existingIndex].lastSearched = Date.now()
  } else {
    analytics.push({
      query: query.trim(),
      count: 1,
      lastSearched: Date.now(),
    })
  }

  analytics.sort((a, b) => b.count - a.count)
  const topAnalytics = analytics.slice(0, 100)

  localStorage.setItem("video_search_analytics", JSON.stringify(topAnalytics))
}

function getLocalSearchAnalytics(): LocalSearchAnalytics[] {
  if (typeof window === "undefined") return []
  try {
    const analytics = localStorage.getItem("video_search_analytics")
    return analytics ? JSON.parse(analytics) : []
  } catch {
    return []
  }
}

export function clearSearchHistory() {
  if (typeof window === "undefined") return
  localStorage.removeItem("video_search_history")
}

export function clearSearchAnalytics() {
  if (typeof window === "undefined") return
  localStorage.removeItem("video_search_analytics")
}
