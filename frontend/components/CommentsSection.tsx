
// app/components/CommentsSection.tsx
import CommentCard from "./CommentCard";

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

async function fetchComments(postId: string): Promise<Comment[]> {
  try {
    const res = await fetch(`/api/comments/${postId}`, {
      method: "GET",
      cache: "no-store", // so it doesn't cache SSR responses
    });

    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export default async function CommentsSection({ postId }: { postId: string }) {
  const comments = await fetchComments(postId);

  // const comments: Comment[] = [
  //   {
  //     id: "1",
  //     author: {
  //       id: "user1",
  //       name: "John Doe",
  //       image: "/placeholder.png",
  //     },
  //     content: "This is a sample comment.",
  //     createdAt: new Date().toLocaleDateString(),
  //     likes: 5,
  //   },
  //   {
  //     id: "2",
  //     author: {
  //       id: "user2",
  //       name: "Jane Smith",
  //       image: "/placeholder.png",
  //     },
  //     content: "This is another sample comment.",
  //     createdAt: new Date().toLocaleDateString(),
  //     likes: 3,
  //   },
  //   {
  //     id: "3",
  //     author: {
  //       id: "user3",
  //       name: "Alice Johnson",
  //       image: "/placeholder.png",
  //     },
  //     content: "This is yet another sample comment.",
  //     createdAt: new Date().toLocaleDateString(),
  //     likes: 8,
  //   },
  // ];

  return (
    <main className="mx-auto md:max-w-[80%] flex flex-col items-center justify-start pt-4  bg-[#EFEAE5] pb-10 md:mb-30 rounded-b-2xl">
      {comments.length > 0 ? (
        <div className="w-[80%]">
          {comments.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))}
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow">No replies yet</div>
      )}
    </main>
  );
}
