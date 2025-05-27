import { gql } from "@apollo/client";

export const GET_HISTORY_QUERY = gql`
  query GetHistory {
    history {
      query
      timestamp
    }
  }
`;

export const GET_ANALYTICS_QUERY = gql`
  query GetAnalytics {
    analytics {
      query
      count
    }
  }
`;

export const CLEAR_HISTORY_MUTATION = gql`
  mutation ClearHistory {
    clearHistory
  }
`;

export const CLEAR_ANALYTICS_MUTATION = gql`
  mutation ClearAnalytics {
    clearAnalytics
  }
`;
