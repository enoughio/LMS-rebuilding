"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Clock, ThumbsUp, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { Post } from "@/types/forum";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import toast from "react-hot-toast";

export default function ForumPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchPost = async (postId: string) => {
    try {
      const res = await fetch(`/api/forum/posts/${postId}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      return await res.json();
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setError("Invalid post ID");
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const postRes = await fetchPost(id);
        setPost(postRes.data);
      } catch {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handlePostLike = async () => {
    if (!post) return;
    try {
      const res = await fetch(`/api/forum/posts/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to like");
      const data = await res.json();
      setPost((prev) =>
        prev ? { ...prev, likeCount: data.data.likeCount, isLiked: data.data.isLiked } : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/forum/posts/${post?.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");

      toast.success("Post deleted");
      router.push("/forum");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete post");
    }
  };

  const handleEdit = () => {
    toast.success("Edit feature coming soon");
  };

  if (loading) return <div className="text-center py-20">Loading post...</div>;
  if (error || !post) return <div className="text-center py-20">{error || "Post not found"}</div>;

  return (
    <div className="w-full pt-10 px-4 sm:px-6 md:px-8">
      <main className="mx-auto md:px-10 w-full max-w-[1100px] flex flex-col items-center justify-start pt-4 pb-5 rounded-2xl bg-[#EFEAE5]">
        <div className="w-full max-w-[90%] p-2 sm:p-4 flex flex-col gap-4 relative">
          <p className="text-2xl font-bold text-gray-800">{post.title}</p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm font-thin">
            <div className="flex items-center gap-2">
              <Image
                src={post.author?.avatar || "/placeholder.svg?height=40&width=40"}
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full bg-gray-500 object-cover"
              />
              <span>asked by @{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={16} />
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Menu */}
          {user?.id === post.authorId && (
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-gray-200 rounded-full">
                  <MoreHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#EFEAE5]" align="end">
                  <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setConfirmOpen(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="w-full max-w-[90%] px-3 text-base flex flex-col gap-4 mt-2">
          <p>{post.content}</p>
          {post.image && (
            <Image
              src={post.image}
              alt="Post"
              width={600}
              height={300}
              className="rounded-lg max-h-[300px] object-cover"
            />
          )}
        </div>

        <div className="w-full py-4 px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <button onClick={handlePostLike}>
              <ThumbsUp className="hover:cursor-pointer" />
            </button>
            {post.likeCount}
          </div>
        </div>
      </main>

      {/* AlertDialog outside dropdown */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-[#EFEAE5]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
