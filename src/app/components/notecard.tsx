'use client';
import { Pencil, Trash2 } from 'lucide-react'
import { Calendar, Maximize2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NoteCard({ note, deleteNote, onTagClick, onClick }: { note: any; deleteNote: (id: string) => void; onTagClick: (tag: string) => void; onClick?: () => void }) {
  return (
    <div className="notecard bg-white p-4 rounded-3xl">
      <h2 className="text-xl font-semibold mb-0">{note.title}</h2>
      <time className="text-xs text-white flex items-center my-1 px-2 py-1 rounded-lg w-fit">
        < Calendar size={14} className="mr-1"/>
        {(() => {
            try {
                return new Date(note.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                });
            } catch {
                return 'Who knows';
            }
        })()}
      </time>
      <div className="prose prose-sm text-gray-700">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
      </div>
      {note.tags && note.tags.length > 0 && (
        <div className="tag flex flex-wrap gap-2 mb-0">
          {note.tags.map((tag: string, index: number) => (
            <span
              key={index}
              onClick={() => onTagClick?.(tag)}
              className=" py-0 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )
      }
      <button
        onClick={() => deleteNote(note.id)}
        className="note-action delete p-2 rounded-3xl text-sm"
      >
        <Trash2 size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation(); // just in case
          onClick?.(); // trigger panel
        }}
        className="note-action edit p-2 rounded-3xl text-sm"
      >
        <Maximize2 size={16} />
      </button>
    </div>
  );
}
