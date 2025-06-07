

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import CommentCard from './CommentCard';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

type Comment = {
  id: string;
  author: { id: string; name: string; image?: string };
  content: string;
  createdAt: string;
  likeCount: number;
  postId?: string;
};

interface PostCommentsProps {
  postId: string;
}

/* ────────────────────────── Component ────────────────────────── */
export default function PostComments({ postId }: PostCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(true);
  /* --------- Helpers --------- */
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments`, 
      {
        cache: 'no-store',
      });
      
      if (!res.ok) throw new Error('Failed to fetch comments');
      const {data} = await res.json();
      console.log('Fetched comments:', data);
      setComments([...data].reverse());
    } catch (err) {
      toast.error('Unable to load comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const submitComment = async () => {
    if (!commentInput.trim()) {
      toast('Please enter a comment');
      return;
    }

    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentInput }),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      setCommentInput('');

      const {data} = await res.json();
      setComments((prev) => [...prev, data].reverse());

      toast.success('Comment submitted!');
    } catch (err) {
      toast.error('Failed to submit comment');
      console.error('Error submitting comment:', err);
    }
  };

  const handleDelete = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };
  /* --------- Effects --------- */
  useEffect(() => {
    fetchComments();
  }, [postId, fetchComments]);

  /* --------- Render --------- */
  return (
    <div className="mx-auto w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] flex flex-col items-center gap-4 sm:gap-6 bg-[#EFEAE5]/60 p-4 sm:p-6 rounded-2xl">
      {/* Comment input */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:max-w-[80%]">
        <Textarea
          placeholder="Add a comment..."
          className="flex-grow bg-transparent p-3 sm:p-4 rounded-lg shadow-inner focus:ring-2 focus:ring-gray-500 text-[clamp(14px,3.5vw,16px)]"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <Button
          className="bg-gray-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto text-[clamp(14px,3.5vw,16px)]"
          onClick={submitComment}
        >
          Submit
        </Button>
      </div>

      {/* Comment list */}
      {loading ? (
        <p className="text-gray-500 text-[clamp(14px,4vw,16px)]">Loading comments…</p>
      ) : comments.length ? (
        <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] space-y-4">
          {comments.map((c) => (
            <CommentCard key={c.id} commentData={c} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <p className="font-thin text-[clamp(14px,4vw,16px)]">Be the first to answer</p>
      )}
    </div>
  );
}