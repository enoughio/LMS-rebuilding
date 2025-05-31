export type ForumCategory = {
  id: string
  name: string
  description: string
  postCount: number
  icon: string
}

export type ForumPost = {
  id: string
  title: string
  content: string
  categoryId: string
  authorId: string
  authorName: string
  authorAvatar: string
  createdAt: string
  updatedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  isPinned: boolean
}

export type ForumComment = {
  id: string
  postId: string
  content: string
  authorId: string
  authorName: string
  authorAvatar: string
  createdAt: string
  likeCount: number
}


export interface Category {
  id: string
  name: string
  // description: string
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

export interface Author {
  id: string
  name: string
  avatar: string | null
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
