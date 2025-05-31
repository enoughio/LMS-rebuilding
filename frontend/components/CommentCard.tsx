"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreVertical } from "lucide-react";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  author: {
    id: string;
    name: string;
    image?: string;
  };
};

interface CommentCardProps {
  commentData: Comment;
  onDelete: (commentId: string) => void;

}

export default function CommentCard({ commentData,  onDelete }: CommentCardProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState<Comment>(commentData);
  const [likes, setLikes] = useState<number>(comment.likeCount || 0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(comment.content);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/forum/comments/${comment.id}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to like comment");

      const { data }: { data: { likeCount: number; isLiked: boolean } } =
        await res.json();

      setLikes(data.likeCount);
      toast.success(data.isLiked ? "Comment liked!" : "Comment unliked!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to like comment");
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/forum/comments/${comment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });
      if (!res.ok) throw new Error("Failed to update comment");
      setComment((prev) => ({
        ...prev,
        content: editedContent,
      }));
      toast.success("Comment updated");
      setIsEditing(false);
    } catch (err) {
      setIsEditing(false);
      toast.error("Update failed");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/forum/comments/${comment.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      toast.success("Comment deleted");
      // You can optionally trigger a UI update or reload here
      setComment((prev) => ({
        ...prev,
        content: "",
      }));

      onDelete(comment.id);

    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    }
  };

  const isAuthor = user?.id === comment.author.id;

  return (
    <div className="bg-[#FBFBFB]/50 p-4 rounded-lg shadow mb-4 relative">
      <div className="flex items-center mb-3">
        {comment.author.image ? (
          <Image
            src={comment.author.image}
            alt={comment.author.name}
            height={24}
            width={24}
            className="w-6 h-6 rounded-full mr-3"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              {comment.author.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-light text-sm">{comment.author.name}</h4>
        </div>

        {isAuthor && !isEditing && (
          <div className="ml-auto relative">
            <button
              className="hover:text-gray-700"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow p-2 z-10 text-sm">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="block px-2 py-1 hover:bg-gray-100 w-full text-left"
                >
                  Edit
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="block px-2 py-1 hover:bg-gray-100 w-full text-left">
                      Delete
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#ECE3DA]/95">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the comment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-[#796146]" >Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-[#796146]" onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <p className="text-gray-500 text-xs font-light mb-1">
          Answered @{new Date(comment.createdAt).toLocaleDateString()}
        </p>

        {isEditing ? (
          <div className="flex flex-col">
            <textarea
              className="text-sm border p-2 rounded mb-2 "
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="text-white bg-gray-500 hover:bg-gray-600 px-3 py-1 text-sm rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(comment.content);
                }}
                className="text-gray-500 hover:text-black text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 text-sm">{comment.content}</p>
        )}
      </div>

      <button
        className="mt-2 text-gray-500 flex items-center hover:cursor-pointer hover:text-black"
        onClick={handleLike}
      >
        <span>👍</span>
        <span className="ml-1">{likes}</span>
      </button>
    </div>
  );
}
