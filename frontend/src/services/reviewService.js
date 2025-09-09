import api from './api';

export const reviewService = {
  // Get reviews for a store
  async getStoreReviews(storeId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/reviews/store/${storeId}?${queryString}`);
    return response;
  },

  // Get user's reviews
  async getUserReviews(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/reviews/user/${userId}?${queryString}`);
    return response;
  },

  // Get review by ID
  async getReviewById(id) {
    const response = await api.get(`/reviews/${id}`);
    return response;
  },

  // Create new review
  async createReview(reviewData) {
    const response = await api.post('/reviews', reviewData);
    return response;
  },

  // Update review
  async updateReview(id, reviewData) {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response;
  },

  // Delete review
  async deleteReview(id) {
    const response = await api.delete(`/reviews/${id}`);
    return response;
  },

  // Get all reviews (admin)
  async getAllReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/reviews?${queryString}`);
    return response;
  }
};