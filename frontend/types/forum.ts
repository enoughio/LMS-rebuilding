// Main types matching backend schema
export type ForumCategory = {
  id: string
  name: string
  description?: string
  icon?: string
  order?: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  // Legacy field for backwards compatibility
  postCount?: number
}

export type ForumPost = {
  id: string
  title: string
  content: string
  image?: string
  tags?: string[]
  isPinned?: boolean
  isLocked?: boolean
  viewCount?: number
  likeCount?: number
  createdAt: string
  updatedAt: string
  authorId: string
  categoryId: string
  // Relations (optional)
  author?: Author
  category?: ForumCategory
  // Additional computed fields
  isLiked?: boolean
  commentCount?: number
  _count?: {
    comments: number
  }
  // Legacy fields for backwards compatibility
  authorName?: string
  authorAvatar?: string
}

export type ForumComment = {
  id: string
  content: string
  likeCount?: number
  createdAt: string
  updatedAt: string
  authorId: string
  postId: string
  // Relations (optional)
  author?: Author
  post?: ForumPost
  // Legacy fields for backwards compatibility
  authorName?: string
  authorAvatar?: string
}

export type ForumPostLike = {
  id: string
  createdAt?: string
  userId: string
  postId: string
  // Relations (optional)
  user?: { id: string; name: string }
  post?: ForumPost
}

export type ForumCommentLike = {
  id: string
  createdAt?: string
  userId: string
  commentId: string
  // Relations (optional)
  user?: { id: string; name: string }
  comment?: ForumComment
}

export type Author = {
  id: string
  name: string
  avatar?: string | null
}

// Legacy types for backwards compatibility
export interface Category {
  id: string
  name: string
  icon?: string
  order?: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  likeCount: number
  author: Author
}

export interface Post {
  id: string
  title?: string
  content?: string
  image?: string | null
  tags?: string[]
  data?: any
  isPinned?: boolean
  isLocked?: boolean
  viewCount?: number
  likeCount?: number
  createdAt: string
  updatedAt: string
  authorId: string
  categoryId: string
  author?: Author
  category?: Category
  isLiked?: boolean
  _count?: {
    comments: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  meta?: {
    page: number
    limit: number
    totalPosts: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}
