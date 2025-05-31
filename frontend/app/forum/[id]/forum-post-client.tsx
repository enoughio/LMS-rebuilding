"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Post } from "@/types/forum";


export default function ForumPostPage() {
  const { id } = useParams(); // Get postId from useParams
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define fetchPost outside useEffect for clarity
  const fetchPost = async (postId: string) => {
    try {
      const url = `/api/forum/posts/${postId}`;
      console.log("Fetching post from:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Error fetching post:", err);
      throw err;
    }
  };

  useEffect(() => {
    // Only fetch if id is available
    if (!id || typeof id !== "string") {
      setError("Invalid post ID");
      setLoading(false);
      return;
    }

    let isMounted = true; // Prevent updates after unmount

    const loadPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const postRes = await fetchPost(id);
        if (isMounted) {
          setPost(postRes.data);
        }

        console.log("Post data:", postRes.data);
      } catch (err) {
        if (isMounted) {
          setError("Failed to load post");
          setPost(null);
        }
        console.error("Error loading post:", err);  
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPost();

    // Cleanup to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [id]); // Depend on id, not postId

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] pt-10">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] pt-10">
        <p className="text-gray-500">{error || "Post not found"}</p>
      </div>
    );
  }

  return (
    <div className="  w-full  pt-10 ">
      <main className="mx-auto md:max-w-[80%] flex flex-col items-center justify-start pt-4 pb-5 rounded-t-2xl bg-[#EFEAE5]">
        <div className="w-full max-w-[85%] p-2 rounded-lg flex flex-col justify-start gap-4">
          <p className="text-2xl font-bold text-gray-800 text-[1.3rem]">
            {post.title}
          </p>
          <div className="flex items-center gap-2 text-sm font-thin">
            <div className="flex items-center gap-2">
              <Image
                src={
                  post.author?.avatar || "/placeholder.svg?height=40&width=40"
                }
                alt={`${post.author?.name}'s Avatar`}
                width={40}
                height={40}
                className="rounded-full bg-gray-500"
              />

              <h4>asked by @ {post.author?.name || "Unknown"}</h4>
            </div>
            <div className="flex justify-center items-center gap-2">
              <Clock />
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-[85%] min-w-[85%]  px-3 text-[15.61px] flex flex-col items-start justify-start gap-2 mt-2">
          <p className="max-w-[90%] text-start">
           {
            post.content || "No content available for this post."
           }
          </p>

          {post.image && (
            <div className="bg-gray-400 max-h-[300px] w-full rounded-lg my-4">
              <Image
                src={post.image}
                alt="Post Image"
                width={600}
                height={300}
                className="w-full h-full rounded-lg mt-4"
              />
            </div>
          )}
        </div>
      </main>
     
    </div>
  );
}







