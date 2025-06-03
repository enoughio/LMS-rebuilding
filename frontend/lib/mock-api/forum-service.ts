import type { ForumCategory, ForumPost, ForumComment } from "@/types/forum"

// Mock forum categories
const categories: ForumCategory[] = [
  {
    id: "cat-1",
    name: "General Discussion",
    description: "General topics related to libraries and reading",
    postCount: 24,
    icon: "MessageSquare",
  },
  {
    id: "cat-2",
    name: "Book Recommendations",
    description: "Recommend and discover new books",
    postCount: 56,
    icon: "BookOpen",
  },
  {
    id: "cat-3",
    name: "Study Tips",
    description: "Share and learn effective study techniques",
    postCount: 38,
    icon: "Lightbulb",
  },
  {
    id: "cat-4",
    name: "Library Facilities",
    description: "Discussions about library amenities and services",
    postCount: 17,
    icon: "Building",
  },
  {
    id: "cat-5",
    name: "Technical Support",
    description: "Get help with platform-related issues",
    postCount: 12,
    icon: "HelpCircle",
  },
]

// Mock forum posts
const posts: ForumPost[] = [
  {
    id: "post-1",
    title: "Best study techniques for long reading sessions",
    content:
      "I'm preparing for my exams and need to read for extended periods. What techniques do you use to maintain focus during long reading sessions?",
    categoryId: "cat-3",
    authorId: "user-1",
    authorName: "John Member",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 156,
    likeCount: 24,
    commentCount: 8,
    isPinned: false,
  },
  {
    id: "post-2",
    title: "Recommended books for software engineering",
    content:
      "I'm looking to expand my knowledge in software engineering. Can anyone recommend some must-read books in this field?",
    categoryId: "cat-2",
    authorId: "user-2",
    authorName: "Jane Member",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 230,
    likeCount: 45,
    commentCount: 12,
    isPinned: true,
  },
  {
    id: "post-3",
    title: "How to make the most of library resources",
    content:
      "I recently joined a library and want to make sure I'm utilizing all available resources. What are some lesser-known services that libraries typically offer?",
    categoryId: "cat-4",
    authorId: "user-1",
    authorName: "John Member",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 189,
    likeCount: 32,
    commentCount: 7,
    isPinned: false,
  },
  {
    id: "post-4",
    title: "Platform issues with seat booking",
    content:
      "Is anyone else experiencing issues with the seat booking system? I'm trying to book a seat for tomorrow but keep getting an error.",
    categoryId: "cat-5",
    authorId: "user-2",
    authorName: "Jane Member",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 78,
    likeCount: 5,
    commentCount: 15,
    isPinned: false,
  },
  {
    id: "post-5",
    title: "Welcome to the forum! Read this first",
    content:
      "Welcome to our community forum! This is a place to discuss all things related to libraries, reading, and studying. Please be respectful of others and follow our community guidelines.",
    categoryId: "cat-1",
    authorId: "user-4",
    authorName: "Bob SuperAdmin",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 1250,
    likeCount: 180,
    commentCount: 25,
    isPinned: true,
  },
]

// Mock forum comments
const comments: ForumComment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    content:
      "I find the Pomodoro technique really effective. 25 minutes of focused study followed by a 5-minute break.",
    authorId: "user-3",
    authorName: "Alice Admin",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likeCount: 12,
  },
  {
    id: "comment-2",
    postId: "post-1",
    content:
      "Active recall has been a game-changer for me. Instead of just reading, I try to recall the information without looking at the text.",
    authorId: "user-2",
    authorName: "Jane Member",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likeCount: 8,
  },
  {
    id: "comment-3",
    postId: "post-2",
    content: "Clean Code by Robert C. Martin is a must-read for any software engineer.",
    authorId: "user-1",
    authorName: "John Member",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    likeCount: 15,
  },
  {
    id: "comment-4",
    postId: "post-2",
    content: "I'd also recommend Design Patterns by the Gang of Four. It's a classic that has stood the test of time.",
    authorId: "user-3",
    authorName: "Alice Admin",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    likeCount: 10,
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockForumService = {
  // Get all categories
  getCategories: async (): Promise<ForumCategory[]> => {
    await delay(500) // Simulate network delay
    return categories
  },

  // Get posts by category
  getPostsByCategory: async (categoryId: string): Promise<ForumPost[]> => {
    await delay(700) // Simulate network delay
    return posts.filter((post) => post.categoryId === categoryId)
  },

  // Get all posts
  getAllPosts: async (
    page = 1,
    limit = 10,
  ): Promise<{
    posts: ForumPost[]
    total: number
    page: number
    totalPages: number
  }> => {
    await delay(700) // Simulate network delay

    const sortedPosts = [...posts].sort((a, b) => {
      // Pinned posts first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      // Then by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedPosts = sortedPosts.slice(start, end)

    return {
      posts: paginatedPosts,
      total: posts.length,
      page,
      totalPages: Math.ceil(posts.length / limit),
    }
  },

  // Get post by ID
  getPost: async (postId: string): Promise<ForumPost | null> => {
    await delay(500) // Simulate network delay

    const post = posts.find((p) => p.id === postId)
    if (!post) return null

    // Increment view count
    post.viewCount += 1

    return post
  },

  // Get comments for a post
  getComments: async (postId: string): Promise<ForumComment[]> => {
    await delay(600) // Simulate network delay
    return comments.filter((comment) => comment.postId === postId)
  },

  // Create a new post
  createPost: async (postData: {
    title: string
    content: string
    categoryId: string
    authorId: string
    authorName: string
    authorAvatar: string
  }): Promise<ForumPost> => {
    await delay(1000) // Simulate network delay

    const newPost: ForumPost = {
      id: `post-${posts.length + 1}`,
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      isPinned: false,
    }

    posts.push(newPost)

    // Update category post count
    const category = categories.find((c) => c.id === postData.categoryId)
    if (category) {
      category.postCount += 1
    }

    return newPost
  },

  // Create a new comment
  createComment: async (commentData: {
    postId: string
    content: string
    authorId: string
    authorName: string
    authorAvatar: string
  }): Promise<ForumComment> => {
    await delay(800) // Simulate network delay

    const newComment: ForumComment = {
      id: `comment-${comments.length + 1}`,
      ...commentData,
      createdAt: new Date().toISOString(),
      likeCount: 0,
    }

    comments.push(newComment)

    // Update post comment count
    const post = posts.find((p) => p.id === commentData.postId)
    if (post) {
      post.commentCount += 1
    }

    return newComment
  },

  // Like a post
  likePost: async (postId: string): Promise<ForumPost> => {
    await delay(400) // Simulate network delay

    const post = posts.find((p) => p.id === postId)
    if (!post) {
      throw new Error("Post not found")
    }

    post.likeCount += 1
    return post
  },

  // Like a comment
  likeComment: async (commentId: string): Promise<ForumComment> => {
    await delay(400) // Simulate network delay

    const comment = comments.find((c) => c.id === commentId)
    if (!comment) {
      throw new Error("Comment not found")
    }

    comment.likeCount += 1
    return comment
  },
}
