'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Save } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NoteForm({ addNote }: { addNote: (note: any) => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedcontent = content.trim();

    if (!trimmedTitle || !trimmedcontent) {
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return;
    }



    addNote({ 
        id: uuidv4(), 
        title, 
        content , 
        createdAt: new Date().toISOString(),
        tags: tagsInput.split(',').map((tag) => tag.trim()).filter((tag) => tag !== '')
  });

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.9 },
  });

    setTitle('');
    setContent('');
    setTagsInput('');
    setShowWarning(false);

    
}

  return (
    <form onSubmit={handleSubmit} className="rounded-4xl">
      <input
        type="text"
        placeholder="Title"
        className="w-full mb-2 px-3 py-2 rounded-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="✨ Cast your thoughts here... Markdown works too: **bold**, # Headings, [links]()"
        className="w-full mb-0 px-3 py-2 rounded-lg"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        className="w-full mb-2 px-3 py-2 rounded-lg"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />
      {showWarning && (
        <p className="text-red-500">Please fill in both title and content.</p>
      )}
      <button
        type="submit"
        className=" px-2 py-2 border rounded-lg hover:bg-white-800"
      >
        < Save size={24} />
      </button>
    </form>
  );
  }
