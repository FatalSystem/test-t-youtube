import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Video {
    videoId: ID!
    title: String!
    description: String!
    thumbnailUrl: String!
    publishedAt: String!
    viewCount: Int!
    likeCount: Int!
    commentCount: Int!
  }

  type SearchResult {
    results: [Video!]!
    totalResults: Int!
    nextPageToken: String
    prevPageToken: String
  }

  type SearchHistoryItem {
    query: String!
    timestamp: String!
  }

  type SearchHistory {
    history: [SearchHistoryItem!]!
  }

  type AnalyticsItem {
    query: String!
    count: Int!
  }

  type Analytics {
    analytics: [AnalyticsItem!]!
  }

  type Query {
    search(query: String!, pageToken: String, maxResults: Int): SearchResult!
    video(id: ID!): Video!
    history: SearchHistory!
    analytics: Analytics!
  }

  type Mutation {
    addToHistory(query: String!, resultsCount: Int!): Boolean!
    clearHistory: Boolean!
    clearAnalytics: Boolean!
  }
`;
