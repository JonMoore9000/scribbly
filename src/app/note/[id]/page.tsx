'use client';

import { use } from 'react';
import { getNoteById } from '../../../lib/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

export default function NotePage(promise: Promise<{ params: { id: string } }>) {
  const { params } = use(promise);
  const { id } = params;

  const notePromise = getNoteById(id);
  const note = use(notePromise);

  if (!note) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
      <div className="prose dark:prose-invert mb-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {note.content}
        </ReactMarkdown>
      </div>
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag: string, i: number) => (
            <span key={i} className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-400">
        Created on{' '}
        {new Date(note.createdAt.toDate?.() ?? note.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>
    </div>
  );
}
