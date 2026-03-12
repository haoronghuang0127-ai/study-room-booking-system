import apiClient from './client';
import type { Review, ReviewCreatePayload } from '../types';

// api functions for get reviews
export async function getReviews(roomId?: number) {
  const { data } = await apiClient.get<Review[]>('/api/reviews/', {
    params: roomId ? { room: roomId } : undefined,
  });
  return data;
}

// api functions for create review
export async function createReview(payload: ReviewCreatePayload) {
  const { data } = await apiClient.post('/api/reviews/', payload);
  return data;
}