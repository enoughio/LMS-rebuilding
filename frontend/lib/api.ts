// API utilities for communicating with the backend

import { error } from "console";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Add credentials to include cookies
  config.credentials = 'include';

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${error}`);
    throw error;
  }
};

// Forum API functions
export const forumApi = {
  // Get all posts with filters
  getPosts: (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sort?: 'hot' | 'new' | 'top';
    period?: 'all' | 'today' | 'week' | 'month' | 'year';
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.period) queryParams.append('period', params.period);
    
    const queryString = queryParams.toString();
    return apiRequest(`/api/forum${queryString ? `?${queryString}` : ''}`);
  },

  // Get a single post by ID
  getPost: (id: string) => apiRequest(`/api/forum/${id}`),

  // Get comments for a post
  getPostComments: (postId: string, page = 1, limit = 20) => 
    apiRequest(`/api/forum/${postId}/comments?page=${page}&limit=${limit}`),

  // Create a new post
  createPost: (postData: { title: string; content: string; category: string }) => 
    apiRequest('/api/forum', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

  // Update a post
  updatePost: (id: string, postData: { title?: string; content?: string; category?: string }) => 
    apiRequest(`/api/forum/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),

  // Delete a post
  deletePost: (id: string) => 
    apiRequest(`/api/forum/${id}`, { method: 'DELETE' }),

  // Like a post
  likePost: (id: string) => 
    apiRequest(`/api/forum/${id}/like`, { method: 'POST' }),

  // Add a comment to a post
  addComment: (postId: string, content: string) => 
    apiRequest(`/api/forum/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // Get all categories
  getCategories: () => apiRequest('/api/forum/categories'),

  // Get posts by category
  getPostsByCategory: (categoryId: string, page = 1, limit = 20, sort = 'new') => 
    apiRequest(`/api/forum/by-category/${categoryId}?page=${page}&limit=${limit}&sort=${sort}`),

  // Search posts
  searchPosts: (query: string, page = 1, limit = 20) => 
    apiRequest(`/api/forum/search?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`),
};
export default apiRequest;
