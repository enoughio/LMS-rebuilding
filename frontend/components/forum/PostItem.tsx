"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Author = {
  id: string;
  name: string;
  avatar: string | null;
};

type Category = {
  id: string;
  name: string;
  icon?: string;
};

type PostItemProps = {
  id: string;
  title: string;
  content: string;
  author: Author;
  category: Category;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPinned?: boolean;
  tags?: string[];
};

export default function PostItem({
  id,
  title,
  content,
  author,
  category,
  createdAt,
  viewCount,
  likeCount,
  commentCount,
  isPinned = false,
  tags = [],
}: PostItemProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likeCount);
  const [likeError, setLikeError] = useState<string | null>(null);

  const truncateContent = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + "...";
  };

  // Strip HTML tags from content for plain text display
  const plainTextContent = content.replace(/<[^>]*>/g, "");

  const handleLike = async () => {
    try {
      setIsLiking(true);
      setLikeError(null);
      // Here you would call your API to like the post
      // For now, we'll just increment the count client-side
      setCurrentLikes((prev) => prev + 1);
    } catch (error) {
      console.error("Error liking post:", error);
      setLikeError("Failed to like post. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className=" mb-4  max-h-[280px] hover:shadow-lg shadow-md transition-shadow bg-[#EFEAE5]">
      <Link href={`/forum/${id}`} className="block">
        <CardHeader className="px-4 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={author.avatar || "/placeholder-user.jpg"}
                  alt={author.name}
                />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{author.name}</span>
                  {isPinned && (
                    <Badge variant="outline" className="text-xs">
                      Pinned
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="flex items-center gap-1">
                {category.icon && (
                  <span className="text-xs">{category.icon}</span>
                )}
                <span className="text-xs">{category.name}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
            {title}
          </h3>
          {/* <p className="text-gray-600 line-clamp-2">
            {truncateContent(plainTextContent)}
          </p> */}
          <p className="text-gray-600 line-clamp-3">
            {plainTextContent.length > 150
              ? truncateContent(plainTextContent, 150)
              : plainTextContent}
          </p>


          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-500 hover:text-primary"
                onClick={handleLike}
                disabled={isLiking}
              >
                <Eye size={16} />
                <span>{viewCount}</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-500 hover:text-primary"
              onClick={handleLike}
              disabled={isLiking}
            >
              <ThumbsUp size={16} className={cn(likeError && "text-red-500")} />
              <span>{currentLikes}</span>
            </Button>

            {/* <Link href={`/forum/${id}`}> */}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-500 hover:text-primary"
              >
                <MessageSquare size={16} />
                <span>{commentCount}</span>
              </Button>
            {/* </Link> */}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
