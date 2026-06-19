import axios from 'axios';

export type Review = {
  id: number;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
};

export type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

export type SummarizeResponse = {
  summary: string;
};

export const reviewApi = {
  fetchReviews: async (productId: number): Promise<GetReviewsResponse> => {
    return axios
      .get<GetReviewsResponse>(`/api/products/${productId}/reviews`)
      .then((res) => res.data);
  },
  summarizeReviews: async (productId: number): Promise<SummarizeResponse> => {
    return axios
      .post<SummarizeResponse>(`/api/products/${productId}/reviews/summarize`)
      .then((res) => res.data);
  },
};
