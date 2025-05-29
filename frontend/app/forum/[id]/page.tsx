





import CommentsSection from '@/components/CommentsSection';
import { forumApi } from '@/lib/forum';


// type ForumPost = {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   updatedAt: string;
//   viewCount: number;
//   likeCount: number;
//   isLikedByUser?: boolean;
//   author: {
//     id: string;
//     name: string;
//     avatar: string | null;
//   };
//   category: {
//     id: string;
//     name: string;
//   };
//   commentCount?: number;
// };



export default async function ForumPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id : postId} = await params;

  const result = await forumApi.getPost(postId);

  if (!result.success || !result.data) {
    return <div className="p-6 text-red-500">Post not found or failed to load.</div>;
  }

  const post = result.data;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-6">{post.content}</p>
      
      <div className="text-sm text-gray-500 mb-4">
        {post.viewCount} views · {post.likeCount} likes
      </div>

      <CommentsSection 
        postId={post.id}
        commentCount={post.commentCount || 0}
        onCommentCountChange={(newCount) => {
          // This won't trigger rerender unless lifted to state — handled in client component
          console.log('Comment count changed:', newCount);
        }}
      />
    </div>
  );
}
