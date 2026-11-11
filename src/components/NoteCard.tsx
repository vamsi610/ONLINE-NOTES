import React from 'react';
import { Pin, Eye, Edit3, Trash2, Calendar, Clock, Tag } from 'lucide-react';
import { INote } from '../types/note.ts';
import { CategoryBadge } from './CategoryBadge.tsx';

interface NoteCardProps {
  note: INote;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (note: INote) => void;
  onTogglePin: (id: string) => void;
  searchQuery?: string;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
  searchQuery,
}) => {
  // Format date and time
  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(note.updatedAt || note.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  // Strip Markdown symbols for clean card preview
  const plainTextSnippet = note.description
    .replace(/[#*`_~>[\]]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .trim();

  // Highlight search term
  const renderHighlighted = (text: string) => {
    if (!searchQuery || !searchQuery.trim()) return text;
    const q = searchQuery.trim();
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-amber-100 text-amber-900 rounded px-0.5 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <article
      className={`group relative bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
        note.isPinned
          ? 'border-indigo-300 ring-1 ring-indigo-200/60 shadow-xs'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Top Banner & Category */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <CategoryBadge category={note.category} />

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note._id);
              }}
              title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
              className={`p-1.5 rounded-lg transition-colors ${
                note.isPinned
                  ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Note Title */}
        <h3
          onClick={() => onView(note._id)}
          className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2"
        >
          {renderHighlighted(note.title)}
        </h3>

        {/* Snippet Preview */}
        <p
          onClick={() => onView(note._id)}
          className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed cursor-pointer font-normal"
        >
          {renderHighlighted(plainTextSnippet)}
        </p>
      </div>

      {/* Tags & Footer Metadata */}
      <div className="px-5 pb-4 pt-1 mt-auto">
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {note.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Date, Time & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-medium text-slate-500">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{formattedTime}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(note._id)}
              title="View Note"
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(note._id)}
              title="Edit Note"
              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(note)}
              title="Delete Note"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
