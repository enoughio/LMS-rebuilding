// 'use client';

// import { useRef, useState, useEffect } from 'react';
// import RichTextEditor from "@/components/forum/textEditor";
// import { useAuth } from "@/lib/context/AuthContext";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// export default function Community() {
//   const [description, setDescription] = useState('');
//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState('');
//   const [categories, setCategories] = useState('');
//   const [notifyOnComment, setNotifyOnComment] = useState(false);
//   const { user } = useAuth();
//   const router = useRouter();
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const richTextEditorRef = useRef<any>(null);

//   // Check if user is logged in
//   useEffect(() => {
//     if (!user) {
//       toast.error('You need to log in before posting a question');
//       router.push('/login');
//     }
//   }, [user, router]);

//   const applyFormat = (startTag: string, endTag: string) => {
//     const textarea = textareaRef.current;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = description.slice(start, end);

//     const newText =
//       description.slice(0, start) +
//       startTag +
//       selectedText +
//       endTag +
//       description.slice(end);

//     setDescription(newText);

//     // Refocus and update cursor position
//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(start + startTag.length, end + startTag.length);
//     }, 0);
//   };


//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       const markdownImage = `![alt text](${imageUrl})`;
//       setDescription((prev) => prev + '\n' + markdownImage + '\n');
//     }
//   };

//   const handlePostQuestion = () => {
//     if (!user) {
//       toast.error('You need to log in before posting a question');
//       router.push('/login');
//       return;
//     }

//     // Add validation for required fields
//     if (!title.trim()) {
//       toast.error('Please provide a question title');
//       return;
//     }

//     // Assuming you have a way to get the content from the rich text editor
//     const content = richTextEditorRef.current?.getContent() || description;
//     if (!content.trim()) {
//       toast.error('Please provide a question description');
//       return;
//     }

//     // Here you would handle the API call to post the question
//     toast.success('Your question has been posted!');
//     // After successful post, redirect to the forum home page or the new question page
//     router.push('/forum');
//   };

//   const handleSaveDraft = () => {
//     if (!user) {
//       toast.error('You need to log in before saving a draft');
//       router.push('/login');
//       return;
//     }

//     // Here you would handle saving the draft logic
//     toast.success('Draft saved successfully');
//   };

//   return (

//     <div className="min-h-screen flex flex-col bg-[#ECE3DA]">
//       {/* <Navbar /> */}


//       <main className="flex-grow w-full px-10 sm:px-14 md:px-20 lg:px-36 py-10">
//         <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8">Ask the Community</h1>

//         {/* Question Title */}
//         <div className="mb-6">
//           <label htmlFor="questionTitle" className="block text-lg font-medium mb-2">Question Title</label>
//           <input
//             id="questionTitle"
//             type="text"
//             placeholder="How do I manage my study streak?"
//             className="w-full p-3 rounded-lg border border-gray-300 bg-[#EFEAE5] focus:outline-none focus:ring-2 focus:ring-black"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           <p className="text-sm text-gray-600 mt-2">Be specific and imagine you're asking a question to another person.</p>
//         </div>

//         {/* Description with Toolbar */}
//         <div className="mb-6 ">
//           <label htmlFor="questionDescription" className="block text-lg font-medium mb-2">Description</label>

//           {/* Toolbar */}
//          <RichTextEditor ref={richTextEditorRef} onContentChange={setDescription} />
//         </div>

//         {/* Tags */}
//         <div className="mb-6">
//           <label htmlFor="tags" className="block text-lg font-medium mb-2">Tags</label>
//           <input
//             id="tags"
//             type="text"
//             placeholder="Add up to 5 tags (comma separated)"
//             className="w-full p-3 rounded-lg border bg-[#EFEAE5] border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//           />
//         </div>


//         {/* Category */}
//         <div className="mb-6">
//           <label htmlFor="categories" className="block text-lg font-medium mb-2">Categories</label>
//           <input
//             id="categories"
//             type="text"
//             placeholder="Add categories"
//             className="w-full p-3 rounded-lg border bg-[#EFEAE5] border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
//             value={categories}
//             onChange={(e) => setCategories(e.target.value)}
//           />
//         </div>

//         {/* Privacy */}
//         <div className="mb-8">
//           <h2 className="text-lg font-medium mb-3">Privacy</h2>
//           <label className="flex items-center gap-3">
//             <input 
//               type="checkbox" 
//               className="h-4 w-4"
//               checked={notifyOnComment}
//               onChange={(e) => setNotifyOnComment(e.target.checked)}
//             />
//             <span>Notify me via email when someone comments</span>
//           </label>
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-4 mb-10">
//           <button 
//             className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
//             onClick={handlePostQuestion}
//           >
//             Post Question
//           </button>
//           <button 
//             className="px-6 py-2 text-black border border-black rounded-full hover:bg-gray-100 transition"
//             onClick={handleSaveDraft}
//           >
//             Save as Draft
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }


import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page