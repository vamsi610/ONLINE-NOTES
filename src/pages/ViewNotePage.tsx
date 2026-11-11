import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Copy,
  Check,
  Download,
  Printer,
  Calendar,
  Clock,
  Pin,
  Tag,
  Share2,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { INote } from '../types/note.ts';
import { CategoryBadge } from '../components/CategoryBadge.tsx';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.tsx';

interface ViewNotePageProps {
  note: INote | null;
  onNavigate: (page: string, noteId?: string) => void;
  onDeleteNote: (id: string) => Promise<void>;
  onTogglePin: (id: string) => Promise<void>;
}

export const ViewNotePage: React.FC<ViewNotePageProps> = ({
  note,
  onNavigate,
  onDeleteNote,
  onTogglePin,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!note) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <p className="text-slate-500 text-sm mb-4">Note not found or deleted.</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Format Dates
  const createdDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const createdTime = new Date(note.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const updatedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const updatedTime = new Date(note.updatedAt || note.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(`${note.title}\nCategory: ${note.category}\n\n${note.description}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const content = `# ${note.title}\n\n**Category**: ${note.category}\n**Created**: ${createdDate} at ${createdTime}\n**Updated**: ${updatedDate} at ${updatedTime}\n**Tags**: ${note.tags.join(', ')}\n\n---\n\n${note.description}`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteNote(note._id);
      setShowDeleteModal(false);
      onNavigate('dashboard');
    } finally {
      setIsDeleting(false);
    }
  };

  // Simple Markdown renderer for code blocks, headers, bullet points
  const renderFormattedDescription = (text: string) => {
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Closing code block
          elements.push(
            <pre
              key={`code-${index}`}
              className="p-4 my-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800"
            >
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          // Opening code block
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="text-base font-bold text-slate-800 mt-4 mb-1">
            {line.replace('#### ', '')}
          </h4>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="ml-5 list-disc text-sm text-slate-700 leading-relaxed mb-1">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={index}
            className="p-3 my-3 border-l-4 border-indigo-500 bg-indigo-50/50 text-xs sm:text-sm text-indigo-950 italic rounded-r-lg"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-3" />);
      } else {
        elements.push(
          <p key={index} className="text-sm text-slate-700 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Actions Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              title="Download Markdown"
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print Note"
              className="p-1.5 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

            <button
              onClick={() => onNavigate('edit', note._id)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Note</span>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              title="Delete Note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Note Article Container */}
        <article className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          {/* Metadata Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CategoryBadge category={note.category} size="md" />
              {note.isPinned && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  <Pin className="w-3 h-3 fill-amber-600" />
                  <span>Pinned Note</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Created: {createdDate} {createdTime}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Updated: {updatedDate} {updatedTime}</span>
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {note.title}
          </h1>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Body Content */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            {renderFormattedDescription(note.description)}
          </div>
        </article>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        note={note}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
