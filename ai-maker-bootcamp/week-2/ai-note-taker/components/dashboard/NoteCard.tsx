"use client";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  section?: {
    name: string;
    color: string;
    icon: string;
  } | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function NoteCard({
  title,
  content,
  createdAt,
  updatedAt,
  fontFamily = "sans-serif",
  fontSize = 16,
  fontColor = "#FFFFFF",
  section,
  onEdit,
  onDelete,
}: NoteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Check if content is HTML
  const isHTML = content.includes('<') && content.includes('>');
  
  // Strip HTML tags for truncation
  const stripHTML = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Truncate content for preview
  const getTruncatedContent = () => {
    const textContent = isHTML ? stripHTML(content) : content;
    if (textContent.length > 150) {
      return textContent.substring(0, 150) + '...';
    }
    return isHTML ? content : textContent;
  };

  const truncatedContent = getTruncatedContent();

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
      {/* Section Badge */}
      {section && (
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3"
          style={{
            backgroundColor: `${section.color}20`,
            color: section.color,
          }}
        >
          <span>{section.icon}</span>
          <span>{section.name}</span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white line-clamp-2 flex-1">
          {title}
        </h3>
        <div className="flex gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
            aria-label="Edit note"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
            aria-label="Delete note"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {isHTML ? (
        <div 
          className="mb-4 line-clamp-4 prose prose-sm dark:prose-invert max-w-none"
          style={{
            fontFamily: fontFamily,
            fontSize: `${Math.min(fontSize, 16)}px`,
            color: fontColor,
          }}
          dangerouslySetInnerHTML={{ __html: truncatedContent }}
        />
      ) : (
        <div 
          className="mb-4 line-clamp-4 prose prose-sm dark:prose-invert max-w-none"
          style={{
            fontFamily: fontFamily,
            fontSize: `${Math.min(fontSize, 16)}px`,
            color: fontColor,
          }}
        >
          <p className="whitespace-pre-wrap">{truncatedContent}</p>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-500 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Updated {formatDate(updatedAt)}</span>
        </div>
        {createdAt !== updatedAt && (
          <span className="text-xs">Edited</span>
        )}
      </div>
    </div>
  );
}

