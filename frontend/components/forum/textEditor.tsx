'use client';

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface RichTextEditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
  isEmpty: boolean;
}

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(({
  initialContent = '',
  onContentChange,
  placeholder = 'Write your question details here...',
  disabled = false
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Check if editor content is empty or just whitespace
  const checkEmpty = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    setIsEmpty(text.trim().length === 0);
  };

  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.innerHTML || '',
    setContent: (content: string) => {
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        checkEmpty();
      }
    },
    isEmpty
  }));

  const applyFormat = (command: 'bold' | 'italic' | 'code') => {
    if (disabled) return;
    
    if (command === 'code') {
      document.execCommand('fontName', false, 'monospace');
    } else {
      document.execCommand(command, false, '');
    }
    editorRef.current?.focus();
    checkEmpty();
  };

  const handleInput = () => {
    checkEmpty();
    if (onContentChange && editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const file = e.target.files?.[0];
    if (file && editorRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.alt = 'uploaded image';
        img.style.maxWidth = '100%';
        const sel = window.getSelection();
        if (!sel?.rangeCount) return;
        sel.getRangeAt(0).insertNode(img);
        
        // Trigger input event for content change detection
        handleInput();
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (initialContent && editorRef.current) {
      editorRef.current.innerHTML = initialContent;
      checkEmpty();
    }
  }, [initialContent]);

  return (
    <div className="w-full shadow rounded-lg relative">
      {/* Toolbar */}
      <div className="flex gap-3 bg-[#efd7bf] p-3 rounded-t-lg">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className={`px-3 py-1 rounded hover:bg-gray-200 font-bold text-black ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Bold"
          title="Bold (Ctrl+B)"
          disabled={disabled}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className={`px-3 py-1 rounded hover:bg-gray-200 italic text-black ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Italic"
          title="Italic (Ctrl+I)"
          disabled={disabled}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('code')}
          className={`px-3 py-1 rounded hover:bg-gray-200 font-mono text-black ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Code"
          title="Code font"
          disabled={disabled}
        >
          {'</>'}
        </button>
        <label
          htmlFor="image-upload"
          className={`px-3 py-1 rounded hover:bg-gray-200 cursor-pointer text-black select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Upload Image"
          aria-label="Upload Image"
        >
          📷
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={disabled}
          />
        </label>
      </div>

      {/* ContentEditable div */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={handleInput}
        className={`w-full min-h-[150px] p-4 bg-[#EFEAE5] border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-black mt-0 ${disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
        spellCheck={true}
        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      ></div>

      {/* Placeholder text */}
      {isEmpty && (
        <div 
          className="absolute top-[60px] left-4 text-gray-400 pointer-events-none" 
          style={{ display: isEmpty ? 'block' : 'none' }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
