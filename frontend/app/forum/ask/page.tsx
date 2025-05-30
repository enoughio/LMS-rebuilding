
'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

const AskQuestion: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [notify, setNotify] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [currentTag, setCurrentTag] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch categories from API on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data: string[] = await response.json();
        setCategories(data);
      } catch (err) {
        setError('Error fetching categories. Please try again.');
        console.error('Error fetching categories:', err); 
      }
    };
    fetchCategories();
  }, []);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = JSON.parse(localStorage.getItem('questionDraft') || '{}') as {
      title?: string;
      description?: string;
      tags?: string[];
      notify?: boolean;
      selectedCategory?: string;
    };
    setTitle(draft.title || '');
    setDescription(draft.description || '');
    setTags(draft.tags || []);
    setNotify(draft.notify || false);
    setSelectedCategory(draft.selectedCategory || '');
  }, []);

  // Save draft to localStorage whenever form changes
  useEffect(() => {
    const draft = { title, description, tags, notify, selectedCategory };
    localStorage.setItem('questionDraft', JSON.stringify(draft));
  }, [title, description, tags, notify, selectedCategory]);

  const handleTagAdd = (): void => {
    if (tags.length >= 5) {
      setError('You can only add up to 5 tags.');
      return;
    }
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleTagRemove = (tag: string): void => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!title.trim()) {
      setError('Question title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!selectedCategory) {
      setError('Please select a category.');
      return;
    }

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tags, notify, category: selectedCategory }),
      });

      if (!response.ok) {
        throw new Error('Failed to post question');
      }

      setSuccess('Question posted successfully!');
      // Clear form and draft
      setTitle('');
      setDescription('');
      setTags([]);
      setNotify(false);
      setSelectedCategory('');
      localStorage.removeItem('questionDraft');
    } catch (err) {
      setError('Error posting question. Please try again.');
      console.error('Error posting question:', err);
    }
  };

  const handleSaveDraft = (): void => {
    setSuccess('Draft saved!');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = e.target;
    if (e.target.name === 'title') setTitle(value);
    if (e.target.name === 'description') setDescription(value);
    if (e.target.name === 'currentTag') setCurrentTag(value);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNotify(e.target.checked);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className='w-full bg-[#ECE3DA] min-h-screen py-20'>
      <div className="w-[70%] mx-auto p-4 ">
        <h1 className="text-3xl font-bold mb-4">Ask the Community</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green- frown mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          {/* Question Title */}
          <div className="mb-4 shadow-t-md p-4 rounded-lg">
            <label className="block text-base font-medium mb-1 ">Question Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleInputChange}
              placeholder="How do I manage my study streak?"
              className="w-full p-2 rounded-md focus:outline-none bg-[#EFEAE5] focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific and imagine you’re asking a question to another person
            </p>
          </div>

          {/* Description */}
          <div className="mb-4 shadow-t-md p-4 rounded-lg">
            <label className="block text-base font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={handleInputChange}
              placeholder="Describe your problem in detail. What have you tried? What did you expect?"
              className="w-full p-2  rounded-md h-40 resize-y focus:outline-none focus:ring-2 bg-[#EFEAE5]  focus:ring-blue-500"
            />
          </div>

          {/* Tags */}
          <div className="mb-4 shadow-t-md px-4 rounded-lg">
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 p-2 bg-[#E0D8D0] rounded-t-md ">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="text-gray-600-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 ">
              <input
                type="text"
                name="currentTag"
                value={currentTag}
                onChange={handleInputChange}
                placeholder="Add up to 5 tags"
                className="w-full p-2 rounded-md focus:outline-none bg-[#EFEAE5] focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="mb-4 shadow-t-md px-4 rounded-lg">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 rounded-md focus:outline-none bg-[#EFEAE5] focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy */}
          <div className="mb-4 shadow-t-md px-4 rounded-lg">
            <label className="block text-sm font-medium mb-1">Privacy</label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notify}
                onChange={handleCheckboxChange}
                className="h-4 w-4"
              />
              <span className="text-sm">
                Notify me via email when someone comments
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 shadow-t-md px-4 rounded-lg">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
            >
              Post Question
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="border border-black px-6 py-2 rounded-full hover:bg-gray-100"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;