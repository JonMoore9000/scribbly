import { getNoteById } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const { params } = props;
  const { id } = await params;

  try {
    const note = await getNoteById(id);
    
    if (!note || !note.public) {
      return {
        title: 'Note not found',
        description: 'This note does not exist or is private',
        robots: 'noindex',
      };
    }
    
    return {
      title: `${note.title} | Scribbly`,
      description: note.content.slice(0, 150),
      openGraph: {
        title: note.title,
        description: note.content.slice(0, 150),
        type: 'article',
        publishedTime: note.createdAt.toString(),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | Scribbly',
      description: 'Something went wrong',
      robots: 'noindex',
    };
  }
}

export default async function NotePage(props: Props) {
  const { params } = props;
  const { id } = await params;

  try {
    const note = await getNoteById(id);

    if (!note || !note.public) {
      return notFound();
    }

    const formattedDate = new Date(
      note.createdAt.toDate?.() ?? note.createdAt
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <main className="max-w-3xl mx-auto mt-4 p-6">
        <Link 
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
        >
          ← Back to notes
        </Link>

        <article className="bg-gray-200 rounded-lg p-6 shadow-sm">
          <header className="mb-6">
            <div className="text-4xl mb-2">{note.emoji}</div>
            <h1 className="text-3xl text-gray-800 font-bold mb-2">
              {note.title}
            </h1>
            <time 
              dateTime={note.createdAt.toString()}
              className="text-sm text-gray-600"
            >
              {formattedDate}
            </time>
          </header>

          <div className="prose prose-lg dark:prose-invert text-gray-800 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {note.content}
            </ReactMarkdown>
          </div>

          {note.tags?.length > 0 && (
            <footer className="mt-6 flex flex-wrap gap-2">
              {note.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </footer>
          )}
        </article>
      </main>
    );
  } catch (error) {
    console.error('Error loading note:', error);
    return notFound();
  }
}
