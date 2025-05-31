
// // app/components/CommentsSection.tsx
// import CommentCard from "./CommentCard";

// type Comment = {
//   id: string;
//   author: {
//     id: string;
//     name: string;
//     image?: string;
//   };
//   content: string;
//   createdAt: string;
//   likes: number;
// };

// async function fetchComments(postId: string): Promise<Comment[]> {
//   try {
//     const res = await fetch(`/api/forum/posts/${postId}/comments`, {
//       method: "GET",
//       cache: "no-store", // so it doesn't cache SSR responses
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch comments");
//     }

//     return await res.json();
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return [];
//   }
// }

// export default async function CommentsSection({ postId }: { postId: string }) {
//   const comments = await fetchComments(postId);

//   // const comments: Comment[] = [
//   //   {
//   //     id: "1",
//   //     author: {
//   //       id: "user1",
//   //       name: "John Doe",
//   //       image: "/placeholder.png",
//   //     },
//   //     content: "This is a sample comment.",
//   //     createdAt: new Date().toLocaleDateString(),
//   //     likes: 5,
//   //   },
//   //   {
//   //     id: "2",
//   //     author: {
//   //       id: "user2",
//   //       name: "Jane Smith",
//   //       image: "/placeholder.png",
//   //     },
//   //     content: "This is another sample comment.",
//   //     createdAt: new Date().toLocaleDateString(),
//   //     likes: 3,
//   //   },
//   //   {
//   //     id: "3",
//   //     author: {
//   //       id: "user3",
//   //       name: "Alice Johnson",
//   //       image: "/placeholder.png",
//   //     },
//   //     content: "This is yet another sample comment.",
//   //     createdAt: new Date().toLocaleDateString(),
//   //     likes: 8,
//   //   },
//   // ];

//   return (
//     <main className="mx-auto w-[80%] flex flex-col items-center justify-start pt-4  bg-[#EFEAE5]/60 pb-10 md:mb-30 rounded-b-2xl">
//       {comments.length > 0 ? (
//         <div className="w-[80%]">
//           {comments.map((c) => (
//             <CommentCard key={c.id} comment={c} />
//           ))}
//         </div>
//       ) : (
//         <div className="p-4  bg-[#EFEAE5] rounded-lg shadow w-[85%]  font-thin">Be The first to answer</div>
//       )}
//     </main>
//   );
// }



'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CommentCard from './CommentCard';
import { Input } from './ui/input';
import { Button } from './ui/button';

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
  const fetchComments = async () => {
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
  };

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
      // await fetchComments(); // refresh list
    } catch (err) {
      toast.error('Failed to submit comment');
      console.error('Error submitting comment:', err);
    }
  };

  const handleDelete = async (commentId: string) => {
    
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  /* --------- Effects --------- */
  useEffect(() => {
    fetchComments();
  }, [postId]);

  /* --------- Render --------- */
  return (
    <div className="mx-auto w-[80%] flex flex-col items-center gap-6 bg-[#EFEAE5]/60 p-4 rounded-2xl">
      {/* Comment input */}
      <div className="w-full flex items-center gap-3">
        <Input
          placeholder="Add a comment..."
          className="flex-grow bg-transparent p-4 rounded-lg shadow-inner focus:ring-2 focus:ring-gray-500"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <Button
          className="bg-gray-600 text-white px-4 py-2 rounded-lg"
          onClick={submitComment}
        >
          Submit
        </Button>
      </div>

      {/* Comment list */}
      {loading ? (
        <p className="text-gray-500">Loading comments…</p>
      ) : comments.length ? (
        <div className="w-full space-y-4">
          {comments.map((c) => (
            <CommentCard key={c.id} commentData={c} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <p className="font-thin">Be the first to answer</p>
      )}
    </div>
  );
}
