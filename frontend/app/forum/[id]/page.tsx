import ForumPostPage from './forum-post-client';
import CommentsSection from '@/components/CommentsSection';

// 👇 1.  params is now a *Promise*
type Params = Promise<{ id: string }>;

export default async function Page(
  { params }: { params: Params }   
) {
  const { id } = await params;      
  return (
    <div className="flex flex-col  w-[99vw] overflow-x-hidden min-h-screen bg-[#ECE3DA] pb-20">
      <ForumPostPage />
      <CommentsSection key={`comments-${id}`} postId={id} />
    </div>
  );
}
