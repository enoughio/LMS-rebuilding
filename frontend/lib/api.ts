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