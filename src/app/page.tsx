'use client';

import { useState, useEffect } from 'react';
import NoteForm from './components/noteform';
import NoteCard from './components/notecard';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X } from 'lucide-react';
import { Download, Upload, Pen, Maximize2, NotebookPen, SquarePen} from 'lucide-react';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (note: Note) => {
    setNotes([note, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedTags, setEditedTags] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFormPanel, setShowFormPanel] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      setEditedTitle(selectedNote.title);
      setEditedContent(selectedNote.content);
      setEditedTags(selectedNote.tags?.join(', ') || '');
      setIsEditing(false); // reset when new note is selected
    }
  }, [selectedNote]);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);
  

  const handleSaveEdit = () => {
    if (!selectedNote) return;

    const updatedNote = {
      ...selectedNote,
      title: editedTitle.trim(),
      content: editedContent.trim(),
      tags: editedTags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };

    const updatedNotes = notes.map((note) => 
      note.id === updatedNote.id ? updatedNote : note
    );

    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setSelectedNote(updatedNote);
    setIsEditing(false);

  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  
    // Apply the class to <html>
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleImportNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedNotes = JSON.parse(event.target?.result as string);

        if (Array.isArray(importedNotes)) {
          const validNotes = importedNotes.filter(
            (n) => n.id && n.title && n.content && n.createdAt && n.tags
          );
          setNotes([...notes, ...validNotes]);
        } else {
          alert('Invalid file format');
        }
      } catch (err) {
        alert('Error reading file');
      }
    };
    reader.readAsText(file);
 }  
  const filteredNotes = selectedTag
    ? notes.filter((note) => note.tags.includes(selectedTag))
    : notes;

  return (
    <main className="min-h-screen p-4 bg-gray-200 transition-colors">
      <nav className="flex bg-white m-auto rounded-3xl py-2 px-4 items-center w-full md:w-[350px] justify-between items-center mb-4 relative">
      <h1 className="text-3xl font-bold text-center text-indigo-600">Scribbly</h1>
      <div>
      <button
        onClick={toggleDarkMode}
        className="toggle-dark text-sm text-gray-600 dark:text-gray-300 top-4 right-4"
      >
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
      <div className="relative group inline-block">
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(notes, null, 2)], {
              type: 'application/json',
            });
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // e.g., "2025-04-18"
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `scribbly-notes-${formattedDate}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="download p-2 rounded-3xl text-sm hover:bg-primary/10 transition"
        >
          <Download size={22} />
        </button>

        {/* Tooltip */}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
                        opacity-0 group-hover:opacity-100 transition bg-white text-black text-xs 
                        px-2 py-1 rounded pointer-events-none z-10 whitespace-nowrap">
          Export Notes
        </span>
      </div>
      <div className="relative group inline-block">
        <label
          htmlFor="import-notes"
          className="upload rounded-3xl mx-2 cursor-pointer inline-flex items-center p-2 hover:bg-primary/10 transition"
        >
          <Upload size={22} />
        </label>

        {/* Tooltip */}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
                        opacity-0 group-hover:opacity-100 transition bg-white text-black text-xs 
                        px-2 py-1 rounded pointer-events-none z-10 whitespace-nowrap">
          Import Notes
        </span>

        <input
          type="file"
          accept=".json"
          id="import-notes"
          onChange={handleImportNotes}
          className="hidden"
        />
      </div>
      <button
        onClick={() => setShowFormPanel(true)}
        className="create-note-btn rounded-3xl cursor-pointer inline-flex items-center p-2"
      >
        < NotebookPen size={22} />
      </button></div>
      
      </nav>
      <AnimatePresence>
      {showFormPanel && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="fixed panel-wrapper create-note inset-0 bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="panel bg-white rounded-3xl max-w-xl w-full p-6 absolute">
            <button
              onClick={() => setShowFormPanel(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Create a Note</h2>
            <NoteForm addNote={(note) => {
              addNote(note);
              setShowFormPanel(false); // close panel after saving
            }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
      {selectedTag && (
        <div className="mb-4 text-center">
          <span className="text-sm">
            Filtering by <strong>#{selectedTag}</strong>
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className="ml-2 text-blue-600 underline text-sm"
          >
            Clear filter
          </button>
        </div>
      )}
      {notes.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
          <p className="text-lg">📝 Start your first note!</p>
          <p className="text-sm inline-flex items-center">Click the <NotebookPen className="mx-2" size={20} /> button to begin writing.</p>
        </div>
      )}
      <div className="max-w-7xl mx-auto w-full px-0">
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} deleteNote={deleteNote} onTagClick={(tag: string) => setSelectedTag(tag)} onClick={() => setSelectedNote(note)} />
        ))}
      </div>
      </div>
      <AnimatePresence>
      {selectedNote && (
        <motion.div initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }} className="panel-wrapper fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="panel bg-white rounded-3xl max-w-xl w-full p-6 absolute">
            <div className="relative">
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            {isEditing ? (
              <>
              <div className="edit-note">
                <input
                  className="w-full mb-2 border rounded px-3 py-2"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <textarea
                  className="w-full mb-2 border rounded px-3 py-2"
                  rows={6}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <input
                  className="w-full mb-2 border rounded px-3 py-2"
                  value={editedTags}
                  onChange={(e) => setEditedTags(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setIsEditing(false)} className="text-sm text-gray-500 hover:underline">
                    Cancel
                  </button>
                  <button onClick={handleSaveEdit} className="basic-btn">
                    Save
                  </button>
                </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">{selectedNote.title}</h2>
                <div className="edit-preview p-3 rounded-lg prose prose-sm text-gray-700">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedNote.content}</ReactMarkdown>
                </div>

                {selectedNote.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {selectedNote.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="tag text-blue-700 text-xs py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-4">
                  {new Date(selectedNote.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-note-btn mt-4 flex items-center text-sm"
                >
                   <SquarePen size={16} className="mr-2" /> Edit Note
                </button>
              </>
            )}      
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </main>
  );
}
