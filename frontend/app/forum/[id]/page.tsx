import CommentsSection from "@/components/CommentsSection";
import AddCommet from "@/components/AddCommet";
import { Clock } from "lucide-react";
import Image from "next/image";

export default async function ForumPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = await params;

  const fetchPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "GET",
        cache: "no-store", // so it doesn't cache SSR responses
      });

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      return await response.json();
    }
    catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }

  const post = await fetchPost(postId)

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-[#ECE3DA] w-full min-h-[90vh] pt-10 ">
      <main className="mx-auto  md:max-w-[80%] flex flex-col items-center justify-start pt-4 pb-5 rounded-t-2xl  bg-[#EFEAE5]">
        <div className="w-full max-w-[85%] p-2 rounded-lg  flex flex-col justify-start gap-4">
          <p className="text-2xl font-bold text-gray-800 text-[1.3rem] ">
            Lorem ipsum dolor sit amet aliquam iste inventore molestias,
            accusantium veniam obcaecati.
          </p>
          <div className="flex items-center gap-2 text-sm font-thin">
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full bg-gray-500"
              />
              <h4>asked by @ {post.auther}</h4>
            </div>
            <div className="flex justify-center items-center gap-2 ">
              <Clock /> {post.createdAt}
            </div>
          </div>
        </div>

        <div className="max-w-[85%] px-3 text-[15.61px] flex flex-col items-start justify-start gap-2 mt-2">
          <p className="max-w-[90%]"> 
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam
            dolorem possimus harum hic perspiciatis explicabo vitae excepturi
            voluptatibus quae magnam? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Corrupti fuga mollitia atque minima, natus
            repellendus dolorum, incidunt a necessitatibus rem quas aut dolor,
            fugiat repudiandae vitae quam voluptas. Quisquam, ipsam!
          </p>

          {post.image && (
            <div className="bg-gray-400 max-h-[300px] w-full rounded-lg  my-4">
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
        <div className="w-full">
        <AddCommet postId={post.id} />
        <CommentsSection
          postId={post.id}
          />
          </div>
    </div>
  );
}
