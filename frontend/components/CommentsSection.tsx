

'use client';

import { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { forumApi } from '@/lib/forum';

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
};


type CommentPagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

// interface CommentsProps {
//   postId: string;
//   commentCount: number;
//   onCommentCountChange: (count: number) => void;
// }


interface CommentsProps {
  postId: string;
  commentCount: number;
  onCommentCountChange: (count: number) => void;
}


// Separate Comments Component
export default function CommentsSection({ postId, commentCount, onCommentCountChange }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<CommentPagination | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const fetchComments = useCallback(async (page: number) => {
    setCommentsLoading(true);
    try {
      const result = await forumApi.getPostComments(postId, page, 10);
      if (result.success) {
        setComments(result.data);
        setPagination(result.pagination);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setPostingComment(true);
    try {
      const result = await forumApi.addComment(postId, newComment);
      if (result.success) {
        setNewComment('');
        await fetchComments(1); // Refresh to first page
        onCommentCountChange(commentCount + 1);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setPostingComment(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;
    
    try {
      const result = await forumApi.updateComment(commentId, editContent);
      if (result.success) {
        setEditingComment(null);
        setEditContent('');
        await fetchComments(currentPage);
      }
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const result = await forumApi.deleteComment(commentId);
      if (result.success) {
        await fetchComments(currentPage);
        onCommentCountChange(commentCount - 1);
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h2 className="text-xl font-bold mb-6">Comments ({commentCount})</h2>

      {/* Comment Form */}
      <div className="mb-8">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          disabled={postingComment}
        />
        <Button 
          onClick={handleSubmitComment} 
          className="mt-2"
          disabled={postingComment || !newComment.trim()}
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
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start">
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
                
                {/* Comment Actions - You might want to add user permission checks here */}
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(comment)}
                    className="p-1 h-auto"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1 h-auto text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {editingComment === comment.id ? (
                <div className="ml-11">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                  <div className="flex space-x-2 mt-2">
                    <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="ml-11 text-gray-700">{comment.content}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            onClick={() => fetchComments(currentPage - 1)}
            disabled={!pagination.hasPrevPage || commentsLoading}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => fetchComments(page)}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              disabled={commentsLoading}
            >
              {page}
            </Button>
          ))}
          
          <Button
            onClick={() => fetchComments(currentPage + 1)}
            disabled={!pagination.hasNextPage || commentsLoading}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}