'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ThumbsUp, Eye, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { forumApi } from '@/lib/api';

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  likeCount?: number;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

type ForumPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  isLikedByUser?: boolean;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
  };
  comments?: Comment[];
  _count?: {
    comments: number;
    likes?: number;
  };
};

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [commentPagination, setCommentPagination] = useState<any>(null);
  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await forumApi.getPost(params.id);
        if (!result.success) {
          throw new Error(result.error || 'Failed to load the post');
        }
        
        setPost(result.data);
        
        // Initial comments are already included in the post
        if (result.data?.comments) {
          setComments(result.data.comments);
        }
        
        // Let's also fetch comments with pagination
        await fetchComments(1);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to load the post. It may have been removed or you don\'t have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [params.id]);

  const fetchComments = async (page: number) => {
    setCommentsLoading(true);
    
    try {
      const result = await forumApi.getPostComments(params.id, page, 10);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch comments');
      }
      
      setComments(result.data);
      setCommentPagination(result.pagination);
      setCurrentCommentPage(page);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };
  const handleSubmitComment = async () => {
    if (!comment.trim() || !post) return;
    
    setPostingComment(true);
    
    try {
      const result = await forumApi.addComment(params.id, comment);
      if (!result.success) {
        throw new Error(result.error || 'Failed to post comment');
      }
      
      setComment('');
      // Refresh comments after posting
      await fetchComments(1);
      
      // Update comment count in the post
      setPost({
        ...post,
        _count: {
          ...post._count,
          comments: (post._count?.comments || 0) + 1
        }
      });
    } catch (err: any) {
      console.error('Error posting comment:', err);
    } finally {
      setPostingComment(false);
    }
  };
  const handleLikePost = async () => {
    if (!post) return;

    try {
      const result = await forumApi.likePost(params.id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to like post');
      }
      
      // Update post with new like count
      setPost({
        ...post,
        likeCount: result.data.likeCount,
        isLikedByUser: result.data.isLiked
      });
    } catch (err: any) {
      console.error('Error liking post:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECE3DA] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500 mb-4" />
          <p className="text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#ECE3DA] p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Post not found'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECE3DA] p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 hover:bg-gray-200"
          onClick={() => router.push('/forum')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
        </Button>

        {/* Post Content */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
          <div className="mb-4 flex justify-between items-start">
            <div className="flex items-center">
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={post.author?.avatar || '/placeholder-user.jpg'}
                  alt={post.author?.name || 'User'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{post.author?.name || 'Anonymous'}</h3>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-[#EFEAE5]">
              {post.category?.name || 'Uncategorized'}
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          
          <div 
            className="prose max-w-none mb-6" 
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye size={18} />
                <span>{post.viewCount}</span>
              </div>
              <button 
                onClick={handleLikePost}
                className={`flex items-center space-x-1 ${post.isLikedByUser ? 'text-blue-600' : 'hover:text-blue-600'}`}
              >
                <ThumbsUp size={18} className={post.isLikedByUser ? 'fill-current' : ''} />
                <span>{post.likeCount}</span>
              </button>
              <div className="flex items-center space-x-1">
                <MessageSquare size={18} />
                <span>{post._count?.comments || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Comments</h2>

          {/* Comment Form */}
          <div className="mb-8">
            <textarea
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              disabled={postingComment}
            />
            <Button 
              onClick={handleSubmitComment} 
              className="mt-2"
              disabled={postingComment || !comment.trim()}
            >
              {postingComment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : 'Post Comment'}
            </Button>
          </div>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4">
                  <div className="flex items-start mb-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                      <Image
                        src={comment.author?.avatar || '/placeholder-user.jpg'}
                        alt={comment.author?.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{comment.author?.name || 'Anonymous'}</h4>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className="ml-11 text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
          )}          {/* Comment Pagination */}
          {commentPagination && commentPagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                onClick={() => fetchComments(currentCommentPage - 1)}
                disabled={!commentPagination.hasPrevPage || commentsLoading}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              
              {Array.from({ length: commentPagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => fetchComments(page)}
                  variant={currentCommentPage === page ? "default" : "outline"}
                  size="sm"
                  disabled={commentsLoading}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                onClick={() => fetchComments(currentCommentPage + 1)}
                disabled={!commentPagination.hasNextPage || commentsLoading}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





// import React from 'react'

// const page = () => {
//   return (
//     <div>page</div>
//   )
// }

// export default page