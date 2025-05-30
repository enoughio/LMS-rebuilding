// lib/api/forum.ts (or update your existing forumApi)
const API_BASE = '/api/forum';

export const forumApi = {
  // Get a single post by ID
  getPost: async (postId: string) => {
    const response = await fetch(`${API_BASE}/posts/${postId}`);
    return response.json();
  },

  // Update a post
  updatePost: async (postId: string, data: { title?: string; content?: string; tags?: string[]; image?: string }) => {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete a post
  deletePost: async (postId: string) => {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Toggle like on a post
  likePost: async (postId: string) => {
    const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
      method: 'POST',
    });
    return response.json();
  },

  // Get comments for a post
  getPostComments: async (postId: string, page: number = 1, limit: number = 20) => {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments?page=${page}&limit=${limit}`);
    return response.json();
  },

  // Add a comment to a post
  addComment: async (postId: string, content: string) => {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  // Update a comment
  updateComment: async (commentId: string, content: string) => {
    const response = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  // Delete a comment
  deleteComment: async (commentId: string) => {
    const response = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};