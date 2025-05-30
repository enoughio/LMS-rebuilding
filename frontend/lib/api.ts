// // API utilities for communicating with the backend

// const API_BASE_URL = process.env.NODE_BACKEND_URL || 'http://localhost:5000';

// const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
//   const url = `${API_BASE_URL}${endpoint}`;
  
//   const defaultHeaders = {
//     'Content-Type': 'application/json',
//   };

//   const config = {
//     ...options,
//     headers: {
//       ...defaultHeaders,
//       ...options.headers,
//     },
//   };

//   // Add credentials to include cookies
//   config.credentials = 'include';

//   try {
//     const response = await fetch(url, config);
    
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.error || `API Error: ${response.status}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error(`API request failed: ${error}`);
//     throw error;
//   }
// };

// // Forum API functions
// export const forumApi = {
//   // Get all posts with filters
//   getPosts: (params: {
//     page?: number;
//     limit?: number;
//     search?: string;
//     category?: string;
//     sort?: 'hot' | 'new' | 'top';
//     period?: 'all' | 'today' | 'week' | 'month' | 'year';
//   } = {}) => {
//     const queryParams = new URLSearchParams();
    
//     if (params.page) queryParams.append('page', params.page.toString());
//     if (params.limit) queryParams.append('limit', params.limit.toString());
//     if (params.search) queryParams.append('search', params.search);
//     if (params.category) queryParams.append('category', params.category);
//     if (params.sort) queryParams.append('sort', params.sort);
//     if (params.period) queryParams.append('period', params.period);
    
//     const queryString = queryParams.toString();
//     return apiRequest(`/api/forum${queryString ? `?${queryString}` : ''}`);
//   },

//   // Get a single post by ID
//   getPost: (id: string) => apiRequest(`/api/forum/${id}`),

//   // Get comments for a post
//   getPostComments: (postId: string, page = 1, limit = 20) => 
//     apiRequest(`/api/forum/${postId}/comments?page=${page}&limit=${limit}`),

//   // Create a new post
//   createPost: (postData: { title: string; content: string; category: string }) => 
//     apiRequest('/api/forum', {
//       method: 'POST',
//       body: JSON.stringify(postData),
//     }),

//   // Update a post
//   updatePost: (id: string, postData: { title?: string; content?: string; category?: string }) => 
//     apiRequest(`/api/forum/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(postData),
//     }),

//   // Delete a post
//   deletePost: (id: string) => 
//     apiRequest(`/api/forum/${id}`, { method: 'DELETE' }),

//   // Like a post
//   likePost: (id: string) => 
//     apiRequest(`/api/forum/${id}/like`, { method: 'POST' }),

//   // Add a comment to a post
//   addComment: (postId: string, content: string) => 
//     apiRequest(`/api/forum/${postId}/comment`, {
//       method: 'POST',
//       body: JSON.stringify({ content }),
//     }),

//   // Get all categories
//   getCategories: () => fetch('/api/forum/categories',
//     {
//       method: 'GET',
//       credentials: 'include', // Include cookies for session management
//     }
//   ).then(response => {
//     if (!response.ok) {
//       throw new Error('Failed to fetch categories');
//     }
//     return response.json();
//   }
//   ),

//   // Get posts by category
//   getPostsByCategory: (categoryId: string, page = 1, limit = 20, sort = 'new') => 
//     apiRequest(`/api/forum/by-category/${categoryId}?page=${page}&limit=${limit}&sort=${sort}`),

//   // Search posts
//   searchPosts: (query: string, page = 1, limit = 20) => 
//     apiRequest(`/api/forum/search?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`),
// };
// export default apiRequest;





export type Author = {
  id: string;
  name: string;
  avatar: string | null;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author: Author;
  category: Category;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLikedByUser?: boolean;
  isPinned?: boolean;
  tags?: string[];
};

export type Pagination = {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  pagination?: Pagination;
  error?: string;
};

export type GetPostsParams = {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sort?: 'hot' | 'new' | 'top';
  period?: 'all' | 'today' | 'week' | 'month' | 'year';
};

// API Client
class ForumApiClient {
  private baseUrl = '/api/forum';

  private async fetchApi<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getPosts(params: GetPostsParams = {}): Promise<ApiResponse<Post[]>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`;

    return this.fetchApi<Post[]>(endpoint);
  }

  async getPostsByCategory(
    categoryId: string, 
    page = 1, 
    limit = 10, 
    sort: 'hot' | 'new' | 'top' = 'new'
  ): Promise<ApiResponse<Post[]>> {
    return this.getPosts({ categoryId, page, limit, sort });
  }

  async searchPosts(
    query: string, 
    page = 1, 
    limit = 20
  ): Promise<ApiResponse<Post[]>> {
    return this.getPosts({ search: query, page, limit });
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.fetchApi<Category[]>('/categories');
  }

  async getPost(id: string): Promise<ApiResponse<Post>> {
    return this.fetchApi<Post>(`/posts/${id}`);
  }

  async createPost(postData: {
    title: string;
    content: string;
    categoryId: string;
    tags?: string[];
  }): Promise<ApiResponse<Post>> {
    return this.fetchApi<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: string): Promise<ApiResponse<{ liked: boolean }>> {
    return this.fetchApi<{ liked: boolean }>(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async deletePost(postId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.fetchApi<{ deleted: boolean }>(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }
}

export const forumApi = new ForumApiClient();