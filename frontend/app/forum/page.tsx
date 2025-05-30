'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Loader2, FilterX, Newspaper, ArrowUpLeft } from 'lucide-react';

import PostItem from '@/components/forum/PostItem';
import { Button } from '@/components/ui/button';
import { forumApi, type Post, type Category, type Pagination, type GetPostsParams } from '@/lib/api';

export default function Forum() {
  const router = useRouter();

  const [input, setInput] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [period, setPeriod] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [selectedTab, setSelectedTab] = useState<'hot' | 'new' | 'top'>('new');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    router.push('/forum/ask');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSearch = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await forumApi.searchPosts(input.trim(), 1, 20);
      setPosts(result.data || []);
      setPagination(result.pagination || null);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error searching posts:', err);
      setError('Failed to search posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber === currentPage) return;
    setLoading(true);
    setError(null);

    try {
      await fetchPosts(pageNumber);
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error('Error fetching page data:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      const params: GetPostsParams = {
        page,
        limit: 10,
        sort: selectedTab,
        period,
        ...(selectedCategory && { categoryId: selectedCategory }),
        ...(input.trim() && { search: input.trim() }),
      };

      const result = await forumApi.getPosts(params);
      setPosts(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      throw err;
    }
  }, [selectedCategory, selectedTab, period, input]);

  const fetchCategories = async () => {
    try {
      const result = await forumApi.getCategories();
      setCategories(result.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPosts(), fetchCategories()]);
      } catch (err) {
        console.error('Error initializing forum page:', err);
        setError('Failed to load forum content. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [fetchPosts]);

  useEffect(() => {
    // Refetch posts when filters change
    const refetchPosts = async () => {
      setLoading(true);
      try {
        await fetchPosts(1);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error with filter change:', err);
        setError('Failed to apply filters. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    refetchPosts();
  }, [selectedTab, period, selectedCategory, fetchPosts]);

  const tabs: { name: 'hot' | 'new' | 'top'; icon: React.ReactNode; label: string }[] = [
    { name: 'hot', icon: <FilterX size={16} />, label: 'Hot' },
    { name: 'new', icon: <Newspaper size={16} />, label: 'New' },
    { name: 'top', icon: <ArrowUpLeft size={16} />, label: 'Top' },
  ];

  return (
    <div className="min-h-screen w-full px-4 md:px-2 py-4 max-w-[1920px] bg-[#ECE3DA] md:pb-20">
      <div className=" flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-light text-center text-gray-800 mb-6">
          India&apos;s <span className="font-medium">Smartest Student Forum</span> — Built by You
        </h1>

        {/* Search & Ask Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 justify-center w-full ">
          <div className="flex items-center px-3 py-2 bg-[#EFEAE5] rounded-full w-full sm:w-[60%] shadow-inner">
            <input
              type="text"
              value={input}
              onChange={handleChange}
              placeholder="Search a question..."
              className="flex-grow px-3 bg-transparent focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={handleSearch} 
              className="flex gap-2 items-center"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Search size={18} className="text-black" />
              )}
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>

          <Button
            onClick={handleClick}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition w-full sm:w-auto"
          >
            <Plus size={18} />
            <span className="whitespace-nowrap">Ask Question</span>
          </Button>
        </div>

        {/* Tabs & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setSelectedTab(tab.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 shadow-sm transition-colors ${
                  selectedTab === tab.name ? 'bg-gray-200' : 'bg-white'
                }`}
                disabled={loading}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="sortBy" className="text-gray-700">
              Time:
            </label>
            <select
              id="sortBy"
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'all' | 'today' | 'week' | 'month' | 'year')}
              className="bg-[#DCD8D4] border rounded-full px-3 py-1 focus:outline-none"
              disabled={loading}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors
            ${!selectedCategory ? 'bg-gray-200' : 'bg-[#EFEAE5] hover:bg-gray-100'} shadow-sm`}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </div>
          
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors
                ${selectedCategory === category.id ? 'bg-gray-200' : 'bg-[#EFEAE5] hover:bg-gray-100'} shadow-sm`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center mb-6 p-4 bg-red-50 rounded-lg">
            {error}
            <Button 
              onClick={() => window.location.reload()}
              variant="outline" 
              className="ml-4"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
            <span className="ml-2 text-gray-500">Loading posts...</span>
          </div>
        )}

        {/* Post List */}
        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-600 italic p-12 bg-white rounded-xl">
            No posts found. Be the first to start a discussion!
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="space-y-4 w-full max-w-[900px]">
            {posts.map((post) => (
              <PostItem
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                author={post.author}
                category={post.category}
                createdAt={post.createdAt}
                viewCount={post.viewCount}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage || loading}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => {
              const page = i + 1;
              const shouldShow = 
                page === 1 || 
                page === pagination.totalPages || 
                (page >= currentPage - 2 && page <= currentPage + 2);
              
              if (!shouldShow) return null;
              
              return (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  disabled={loading}
                >
                  {page}
                </Button>
              );
            })}
            
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage || loading}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}