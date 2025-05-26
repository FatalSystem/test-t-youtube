export interface HistoryItem {
  query: string;
  timestamp: string;
}

export interface AnalyticsItem {
  query: string;
  count: number;
}

export interface HistoryResponse {
  history: HistoryItem[];
}

export interface AnalyticsResponse {
  analytics: AnalyticsItem[];
}

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

// Get API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://test.com:3001";

// Generic API request function with error handling
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Search API - GET /search?q={query}&pageToken={token}&maxResults={limit}
export const searchAPI = async (query: string, pageToken?: string, maxResults = 10): Promise<SearchResponse> => {
  const params = new URLSearchParams({
    q: query,
    maxResults: maxResults.toString(),
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  return apiRequest<SearchResponse>(`/search?${params.toString()}`);
};

// Video Details API - GET /video/{videoId}
export const getVideoAPI = async (videoId: string): Promise<VideoData> => {
  return apiRequest<VideoData>(`/video/${videoId}`);
};

// Search History API - GET /history
export const getHistoryAPI = async (): Promise<HistoryResponse> => {
  return apiRequest<HistoryResponse>("/history");
};

// Add to History API - POST /history
export const addToHistoryAPI = async (query: string, resultsCount: number): Promise<void> => {
  return apiRequest<void>("/history", {
    method: "POST",
    body: JSON.stringify({
      query: query.trim(),
      resultsCount,
      timestamp: new Date().toISOString(),
    }),
  });
};

// Clear History API - DELETE /history
export const clearHistoryAPI = async (): Promise<void> => {
  return apiRequest<void>("/history", {
    method: "DELETE",
  });
};

// Analytics API - GET /analytics
export const getAnalyticsAPI = async (): Promise<AnalyticsResponse> => {
  return apiRequest<AnalyticsResponse>("/analytics");
};

// Clear Analytics API - DELETE /analytics
export const clearAnalyticsAPI = async (): Promise<void> => {
  return apiRequest<void>("/analytics", {
    method: "DELETE",
  });
};

// Health Check API - GET /health
export const healthCheckAPI = async (): Promise<{ status: string; timestamp: string }> => {
  return apiRequest<{ status: string; timestamp: string }>("/health");
};

// Helper function to add search to history (now uses API)
export async function addSearchToHistory(query: string, resultsCount: number): Promise<void> {
  try {
    await addToHistoryAPI(query, resultsCount);
  } catch (error) {
    console.error("Failed to add search to history:", error);
    // Don't throw error to prevent search functionality from breaking
  }
}

// Mock API function for GET /history
export const mockHistoryAPI = async (): Promise<HistoryResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get history from localStorage and convert to API format
  const localHistory = getLocalSearchHistory();

  const history: HistoryItem[] = localHistory.map((item) => ({
    query: item.query,
    timestamp: new Date(item.timestamp).toISOString(),
  }));

  return { history };
};

// Mock API function for GET /analytics
export const mockAnalyticsAPI = async (): Promise<AnalyticsResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Get analytics from localStorage and convert to API format
  const localAnalytics = getLocalSearchAnalytics();

  const analytics: AnalyticsItem[] = localAnalytics.map((item) => ({
    query: item.query,
    count: item.count,
  }));

  return { analytics };
};

// Helper functions to interact with localStorage (keeping existing functionality)
interface LocalSearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultsCount: number;
}

interface LocalSearchAnalytics {
  query: string;
  count: number;
  lastSearched: number;
}

const SEARCH_HISTORY_KEY = "video_search_history";
const SEARCH_ANALYTICS_KEY = "video_search_analytics";

function getLocalSearchHistory(): LocalSearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const history = localStorage.getItem("video_search_history");
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

function updateLocalSearchAnalytics(query: string) {
  if (typeof window === "undefined") return;

  const analytics = getLocalSearchAnalytics();
  const normalizedQuery = query.toLowerCase().trim();

  const existingIndex = analytics.findIndex((item) => item.query.toLowerCase() === normalizedQuery);

  if (existingIndex >= 0) {
    analytics[existingIndex].count += 1;
    analytics[existingIndex].lastSearched = Date.now();
  } else {
    analytics.push({
      query: query.trim(),
      count: 1,
      lastSearched: Date.now(),
    });
  }

  analytics.sort((a, b) => b.count - a.count);
  const topAnalytics = analytics.slice(0, 100);

  localStorage.setItem("video_search_analytics", JSON.stringify(topAnalytics));
}

function getLocalSearchAnalytics(): LocalSearchAnalytics[] {
  if (typeof window === "undefined") return [];
  try {
    const analytics = localStorage.getItem("video_search_analytics");
    return analytics ? JSON.parse(analytics) : [];
  } catch {
    return [];
  }
}

export function clearSearchHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("video_search_history");
}

export function clearSearchAnalytics() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("video_search_analytics");
}
