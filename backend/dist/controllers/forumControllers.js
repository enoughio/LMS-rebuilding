import prisma from "../lib/prisma.js";
export const getAllPosts = async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const category = req.query.category;
    //   const sort = (req.query.sort as string) || 'new';
    const period = req.query.period || "all";
    try {
        let filters = {};
        if (category) {
            filters.categoryId = category;
        }
        // Add date filter based on period
        if (period !== "all") {
            const date = new Date();
            switch (period) {
                case "today":
                    date.setHours(0, 0, 0, 0);
                    filters.createdAt = { gte: date };
                    break;
                case "week":
                    date.setDate(date.getDate() - 7);
                    filters.createdAt = { gte: date };
                    break;
                case "month":
                    date.setMonth(date.getMonth() - 1);
                    filters.createdAt = { gte: date };
                    break;
                case "year":
                    date.setFullYear(date.getFullYear() - 1);
                    filters.createdAt = { gte: date };
                    break;
                default:
                    break;
            }
        }
        const posts = await prisma.forumPost.findMany({
            where: {
                ...filters,
            },
            take: limit,
            skip: skip,
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                authorId: true,
                categoryId: true,
                likeCount: true,
                _count: {
                    select: {
                        comments: true,
                    }
                },
            }
        });
        return res.status(200).json({
            success: true,
            data: posts
        });
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const createForumPost = async (req, res) => {
    try {
        const { title, content, categoryId, tags, images } = req.body;
        const userId = req.user.id;
        console.log('Creating forum post with data:', {
            title,
            content,
            categoryId,
        });
        // Validation
        if (!title || !content || !categoryId) {
            res.status(400).json({
                success: false,
                error: 'Title, content, and categoryId are required'
            });
            return;
        }
        // Check if category exists
        const category = await prisma.forumCategory.findUnique({
            where: { id: categoryId }
        });
        if (!category) {
            res.status(404).json({
                success: false,
                error: 'Category not found'
            });
            return;
        }
        // Process images - for now, we'll store the first image URL in the existing image field
        // TODO: Consider updating the schema to support multiple images
        let processedImage;
        if (images && Array.isArray(images) && images.length > 0) {
            // Handle new format: Array<{ url: string; publicId?: string }>
            const firstImage = images[0];
            processedImage = typeof firstImage === 'string' ? firstImage : firstImage.url;
        }
        const post = await prisma.forumPost.create({
            data: {
                title,
                content,
                categoryId,
                authorId: userId,
                tags: tags || [],
                image: processedImage,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            data: {
                ...post,
                isLikedByUser: false,
                likeCount: post._count.likes,
                commentCount: post._count.comments,
                _count: undefined,
            }
        });
    }
    catch (error) {
        console.error('Error creating forum post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create forum post'
        });
    }
};
/**
 * Get all forum posts with pagination
 */
export const getCatagories = async (_req, res) => {
    try {
        const categories = await prisma.forumCategory.findMany({
            orderBy: {
                name: 'asc',
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
        res.json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        console.error('Error fetching forum categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch forum categories'
        });
    }
};
export const getForumPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const categoryId = req.query.categoryId;
        const search = req.query.search;
        const sort = req.query.sort || 'new';
        const period = req.query.period || 'all';
        const userId = req.user?.id;
        const skip = (page - 1) * limit;
        // Build where clause
        const where = {};
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { tags: { has: search } },
            ];
        }
        // Add period filtering
        if (period !== 'all') {
            const now = new Date();
            let startDate;
            switch (period) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
                default:
                    startDate = new Date(0); // Beginning of time
            }
            where.createdAt = {
                gte: startDate
            };
        }
        // Build orderBy clause based on sort
        let orderBy = [{ isPinned: 'desc' }];
        switch (sort) {
            case 'hot':
                // Hot posts: combination of likes, comments, and recency
                orderBy.push({ likeCount: 'desc' });
                orderBy.push({ viewCount: 'desc' });
                orderBy.push({ createdAt: 'desc' });
                break;
            case 'top':
                // Top posts: most liked first
                orderBy.push({ likeCount: 'desc' });
                orderBy.push({ viewCount: 'desc' });
                break;
            case 'new':
            default:
                // New posts: most recent first
                orderBy.push({ createdAt: 'desc' });
                break;
        }
        const [posts, totalCount] = await Promise.all([
            prisma.forumPost.findMany({
                where,
                take: limit,
                skip: skip,
                orderBy,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    _count: {
                        select: {
                            comments: true,
                            likes: true,
                        },
                    },
                    ...(userId && {
                        likes: {
                            where: {
                                userId: userId,
                            },
                            select: {
                                id: true,
                            },
                        },
                    }),
                },
            }),
            prisma.forumPost.count({ where })
        ]);
        const formattedPosts = posts.map(post => ({
            ...post,
            isLikedByUser: userId ? post.likes?.length > 0 : false,
            likes: undefined,
            likeCount: post._count.likes,
            commentCount: post._count.comments,
            _count: undefined,
        }));
        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            success: true,
            data: formattedPosts,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            }
        });
    }
    catch (error) {
        console.error('Error fetching forum posts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch forum posts'
        });
    }
};
/**
 * Get a single forum post by ID
 */
export const getForumPostById = async (req, res) => {
    try {
        console.log('someone is trying to get a forum post by id');
        const { id } = req.params;
        const userId = req.user?.id;
        const post = await prisma.forumPost.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                // comments: {
                //   include: {
                //     author: {
                //       select: {
                //         id: true,
                //         name: true,
                //         avatar: true,
                //       },
                //     },
                //   },
                //   orderBy: {
                //     createdAt: 'asc',
                //   },
                // },
                _count: {
                    select: {
                        likes: true,
                    },
                },
                ...(userId && {
                    likes: {
                        where: {
                            userId: userId,
                        },
                        select: {
                            id: true,
                        },
                    },
                }),
            },
        });
        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Forum post not found'
            });
            return;
        }
        // Increment view count
        await prisma.forumPost.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });
        res.json({
            success: true,
            data: {
                ...post,
                isLikedByUser: userId ? post.likes?.length > 0 : false,
                likes: undefined,
                likeCount: post._count.likes,
                // commentCount: post.comments.length,
                _count: undefined,
            }
        });
    }
    catch (error) {
        console.error('Error fetching forum post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch forum post'
        });
    }
};
/**
 * Update a forum post
 */
export const updateForumPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags, image } = req.body;
        const userId = req.user.id;
        // Check if post exists and user owns it or is admin
        const existingPost = await prisma.forumPost.findUnique({
            where: { id },
            select: { authorId: true },
        });
        if (!existingPost) {
            res.status(404).json({
                success: false,
                error: 'Forum post not found'
            });
            return;
        }
        if (existingPost.authorId !== userId && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            res.status(403).json({
                success: false,
                error: 'Not authorized to update this post'
            });
            return;
        }
        const updatedPost = await prisma.forumPost.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(content && { content }),
                ...(tags && { tags }),
                ...(image !== undefined && { image }),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });
        res.json({
            success: true,
            data: {
                ...updatedPost,
                likeCount: updatedPost._count.likes,
                commentCount: updatedPost._count.comments,
                _count: undefined,
            }
        });
    }
    catch (error) {
        console.error('Error updating forum post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update forum post'
        });
    }
};
/**
 * Delete a forum post
 */
export const deleteForumPost = async (req, res) => {
    try {
        const { postId: id } = req.params;
        const userId = req.user.id;
        // Check if post exists and user owns it or is admin
        const existingPost = await prisma.forumPost.findUnique({
            where: { id },
            select: { authorId: true },
        });
        if (!existingPost) {
            res.status(404).json({
                success: false,
                error: 'Forum post not found'
            });
            return;
        }
        if (existingPost.authorId !== userId && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            res.status(403).json({
                success: false,
                error: 'Not authorized to delete this post'
            });
            return;
        }
        await prisma.forumPost.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: 'Forum post deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting forum post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete forum post'
        });
    }
};
/**
 * Toggle like on a forum post
 */
export const toggleForumPostLike = async (req, res) => {
    try {
        const { postId: id } = req.params; // post ID
        const userId = req.user.id;
        console.log('Toggling like for post ID:', id, 'by user ID:', userId);
        // Check if post exists
        const post = await prisma.forumPost.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Forum post not found'
            });
            return;
        }
        // Check if user has already liked this post
        const existingLike = await prisma.forumPostLike.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId: id,
                },
            },
        });
        let isLiked;
        let likeCount = 0;
        if (existingLike) {
            // Unlike the post
            await prisma.$transaction(async (tx) => {
                await tx.forumPostLike.delete({
                    where: { id: existingLike.id },
                });
                const updatedPost = await tx.forumPost.update({
                    where: { id },
                    data: {
                        likeCount: { decrement: 1 },
                    },
                });
                likeCount = updatedPost.likeCount;
            });
            isLiked = false;
        }
        else {
            // Like the post
            await prisma.$transaction(async (tx) => {
                await tx.forumPostLike.create({
                    data: {
                        userId,
                        postId: id,
                    },
                });
                const updatedPost = await tx.forumPost.update({
                    where: { id },
                    data: {
                        likeCount: { increment: 1 },
                    },
                });
                likeCount = updatedPost.likeCount;
            });
            isLiked = true;
        }
        res.json({
            success: true,
            data: {
                isLiked,
                likeCount,
            }
        });
    }
    catch (error) {
        console.error('Error toggling forum post like:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle like'
        });
    }
};
/**
 * Add a comment to a forum post
 */
export const addForumComment = async (req, res) => {
    try {
        const { postId: id } = req.params; // post ID
        const { content } = req.body;
        const userId = req.user.id;
        console.log('Request body:', req.body);
        if (!content || content.trim().length === 0) {
            res.status(400).json({
                success: false,
                error: 'Comment content is required'
            });
            return;
        }
        // Check if post exists
        const post = await prisma.forumPost.findUnique({
            where: { id },
            select: { id: true, isLocked: true },
        });
        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Forum post not found'
            });
            return;
        }
        if (post.isLocked) {
            res.status(403).json({
                success: false,
                error: 'Cannot comment on a locked post'
            });
            return;
        }
        const comment = await prisma.forumComment.create({
            data: {
                content: content.trim(),
                authorId: userId,
                postId: id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            data: comment
        });
    }
    catch (error) {
        console.error('Error adding forum comment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add comment'
        });
    }
};
/**
 * Update a forum comment
 */
export const updateForumComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        if (!content || content.trim().length === 0) {
            res.status(400).json({
                success: false,
                error: 'Comment content is required'
            });
            return;
        }
        // Check if comment exists and user owns it
        const existingComment = await prisma.forumComment.findUnique({
            where: { id: commentId },
            select: { authorId: true },
        });
        if (!existingComment) {
            res.status(404).json({
                success: false,
                error: 'Comment not found'
            });
            return;
        }
        if (existingComment.authorId !== userId && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            res.status(403).json({
                success: false,
                error: 'Not authorized to update this comment'
            });
            return;
        }
        const updatedComment = await prisma.forumComment.update({
            where: { id: commentId },
            data: { content: content.trim() },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
        res.json({
            success: true,
            data: updatedComment
        });
    }
    catch (error) {
        console.error('Error updating forum comment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update comment'
        });
    }
};
/**
 * Delete a forum comment
 */
export const deleteForumComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        // Check if comment exists and user owns it
        const existingComment = await prisma.forumComment.findUnique({
            where: { id: commentId },
            select: { authorId: true },
        });
        if (!existingComment) {
            res.status(404).json({
                success: false,
                error: 'Comment not found'
            });
            return;
        }
        if (existingComment.authorId !== userId && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
            res.status(403).json({
                success: false,
                error: 'Not authorized to delete this comment'
            });
            return;
        }
        await prisma.forumComment.delete({
            where: { id: commentId },
        });
        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting forum comment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete comment'
        });
    }
};
/**
 * Get comments for a forum post
 */
export const getForumComments = async (req, res) => {
    try {
        const { postId: id } = req.params; // post ID
        const [comments] = await Promise.all([
            prisma.forumComment.findMany({
                where: { postId: id },
                orderBy: { createdAt: 'asc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            }),
        ]);
        res.json({
            success: true,
            data: comments,
        });
    }
    catch (error) {
        console.error('Error fetching forum comments:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch comments'
        });
    }
};
export const likeForumComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        const comment = await prisma.forumComment.findUnique({
            where: { id: commentId },
            select: { id: true },
        });
        if (!comment) {
            res.status(404).json({ success: false, error: "Comment not found" });
            return;
        }
        // Initialize with default values to prevent "used before being assigned" error
        let isLiked = false;
        let likeCount = 0;
        await prisma.$transaction(async (tx) => {
            const existingLike = await tx.forumCommentLike.findUnique({
                where: {
                    userId_commentId: { userId, commentId }, // composite unique key name
                },
            });
            if (existingLike) {
                await tx.forumCommentLike.delete({
                    where: { id: existingLike.id },
                });
                const updated = await tx.forumComment.update({
                    where: { id: commentId },
                    data: { likeCount: { decrement: 1 } },
                });
                likeCount = updated.likeCount;
                isLiked = false;
            }
            else {
                await tx.forumCommentLike.create({
                    data: { userId, commentId },
                });
                const updated = await tx.forumComment.update({
                    where: { id: commentId },
                    data: { likeCount: { increment: 1 } },
                });
                likeCount = updated.likeCount;
                isLiked = true;
            }
        });
        console.log("Comment liked status:", isLiked, "Like count:", likeCount);
        res.json({
            success: true,
            data: { isLiked, likeCount },
        });
    }
    catch (error) {
        console.error("Error liking forum comment:", error);
        res.status(500).json({ success: false, error: "Failed to like comment" });
    }
};
//# sourceMappingURL=forumControllers.js.map