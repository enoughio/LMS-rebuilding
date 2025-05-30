"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

type Comment = {
  id: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
};

export default function CommentCard({ comment }: { comment: Comment }) {
  const [likes, setLikes] = useState(comment.likes);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/comments/${comment.id}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to like comment");

      setLikes((prev) => prev + 1);
      toast.success("Comment liked!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to like comment");
    }
  };

  return (
    <div className="bg-[#FBFBFB] p-4 rounded-lg shadow mb-4">
      <div className="flex items-center mb-3">
        {comment.author.image ? (
          <Image
            src={comment.author?.image}
            alt={comment.author.name}
            height={5}
            width={5}
            className="w-5 h-5 rounded-full mr-3"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
            <span className="text-gray-500">
              {comment.author.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-light text-sm">{comment.author.name}</h4>
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-xs font-light ">Answered @{comment.createdAt}</p>
        <p className="text-gray-800 text-sm">{comment.content}</p>
      </div>

      <button
        className="mt-2 text-gray-500 flex items-center hover:cursor-pointer"
        onClick={handleLike}
      >
        <span>👍</span>
        <span className="ml-1">{likes}</span>
      </button>
    </div>
  );
}
