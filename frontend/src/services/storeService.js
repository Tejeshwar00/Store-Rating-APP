// src/services/storeService.js
import { debounce } from 'lodash'; // This line fixes your error
import { mockStores } from '../data/mockData';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

class StoreService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Get authentication headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  // Debounced search function
  debouncedSearch = debounce(async (query) => {
    return this.searchStores(query);
  }, 300);

  // Get all stores
  async getAllStores() {
    try {
      const response = await fetch(`${API_BASE_URL}/stores`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stores');
      }

      return data;
    } catch (error) {
      console.error('Get stores error:', error);
      throw error;
    }
  }

  // Search stores
  async searchStores(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search stores');
      }

      return data;
    } catch (error) {
      console.error('Search stores error:', error);
      throw error;
    }
  }

  // Get store by ID
  async getStoreById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch store');
      }

      return data;
    } catch (error) {
      console.error('Get store error:', error);
      throw error;
    }
  }

  // Add new store
  async addStore(storeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/stores`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(storeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add store');
      }

      return data;
    } catch (error) {
      console.error('Add store error:', error);
      throw error;
    }
  }

  // Update store
  async updateStore(id, storeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(storeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update store');
      }

      return data;
    } catch (error) {
      console.error('Update store error:', error);
      throw error;
    }
  }

  // Delete store
  async deleteStore(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete store');
      }

      return { success: true };
    } catch (error) {
      console.error('Delete store error:', error);
      throw error;
    }
  }

  // Get stores by category
  async getStoresByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/category/${encodeURIComponent(category)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stores by category');
      }

      return data;
    } catch (error) {
      console.error('Get stores by category error:', error);
      throw error;
    }
  }
}

// Create a single instance
const storeService = new StoreService();

export default storeService;