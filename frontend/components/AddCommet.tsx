'use client';

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import toast from 'react-hot-toast';



const AddCommet = ({postId} : {
  postId: string
} ) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (postId: string, content: string) => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return { success: true };
    } catch (error) {
      console.error('Error submitting comment:', error);
      return { success: false };
    }
  };

  return (
    <div className='flex items-center bg-[#EFEAE5] gap-3 justify-center  w-[80%] MT  mx-auto h-full p-2 pt-4'>
      <Input
        type="text"
        placeholder="Add a comment..."
        className="w-[70%] max-w-3xl p-4 bg-transparent rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
       <Button
        className=" bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg px-2 py-2"
        onClick={async () => {
          // Don't submit if the comment is empty
          if (!comment.trim()) {
            toast('Please enter a comment');
            return;
          }
          
          // Handle comment submission logic here
          const resp = await handleSubmit(postId, comment);
          if (!resp.success) {
            console.error('Failed to submit comment');
            toast.error('Failed to submit comment');
            return;
          }

          // Clear the input after successful submission
          setComment('');
          toast.success('Comment submitted successfully!');
          console.log(`Comment submitted for post ID: ${postId}`);
        }}
      >
        Submit Comment
      </Button>
    </div>
  )
}

export default AddCommet