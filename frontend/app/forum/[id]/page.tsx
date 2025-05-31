import ForumPostPage from './forum-post-client';
import CommentsSection from '@/components/CommentsSection';

// 👇 1.  params is now a *Promise*
type Params = Promise<{ id: string }>;

export default async function Page(
  { params }: { params: Params }   
) {
  const { id } = await params;      

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[#ECE3DA] pb-20">
      <ForumPostPage />
      <CommentsSection postId={id} />
    </div>
  );
}
