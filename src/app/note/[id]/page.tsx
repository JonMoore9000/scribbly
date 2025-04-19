import { getNoteById } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const note = await getNoteById(params.id);
  
  if (!note || !note.public) {
    return {
      title: 'Note not found',
      description: 'This note does not exist or is private'
    };
  }
  
  return {
    title: note.title,
    description: note.content.slice(0, 150),
  };
}

export default async function NotePage({ params }: PageProps) {
  const note = await getNoteById(params.id);

  if (!note || !note.public) {
    return notFound();
  }

  return (
    <main className="max-w-3xl bg-gray-200 mx-auto mt-4 rounded-lg p-6">
      <div className="mb-4">
        <div className="text-4xl mb-2">{note.emoji}</div>
        <h1 className="text-3xl text-gray-800 font-bold mb-2">{note.title}</h1>
        <p className="text-sm text-gray-800">
          {new Date(note.createdAt.toDate?.() ?? note.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="prose dark:prose-invert text-gray-800">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {note.content}
        </ReactMarkdown>
      </div>

      {note.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {note.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </main>
  );
}
