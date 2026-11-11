import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Tag,
  Pin,
  Calendar,
  Clock,
  Bold,
  Italic,
  Code,
  List,
  Heading,
  Quote,
  Eye,
  Edit,
  Sparkles,
  AlertCircle,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { getCustomCategories, addCustomCategory } from '../services/api.ts';

interface CreateNotePageProps {
  onNavigate: (page: string, noteId?: string) => void;
  onCreateNote: (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    isPinned: boolean;
  }) => Promise<void>;
}

export const CreateNotePage: React.FC<CreateNotePageProps> = ({
  onNavigate,
  onCreateNote,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Java');
  const [customSubject, setCustomSubject] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['LectureNotes']);
  const [isPinned, setIsPinned] = useState(false);
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic custom categories
  const customCategories = getCustomCategories();
  const defaultSubjects = ['Java', 'Python', 'DBMS', 'Mathematics', 'Web Development', 'Data Structures', 'Computer Networks', 'Operating Systems', 'General'];
  const allSubjects = Array.from(new Set([...defaultSubjects, ...customCategories]));

  // Auto-calculated stats
  const now = new Date();
  const currentDateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const currentTimeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const charCount = description.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Tag management
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Quick formatting insert helper
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('note-description-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    const newText = text.substring(0, start) + replacement + text.substring(end);
    setDescription(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 10);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a title for your academic note.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide note description or lecture content.');
      return;
    }

    setSaving(true);
    try {
      let finalCategory = category;
      if (isCustomCategory && customSubject.trim()) {
        finalCategory = customSubject.trim();
        addCustomCategory(finalCategory);
      }

      await onCreateNote({
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        tags,
        isPinned,
      });

      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save note to MongoDB');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>

          {/* Automatic Date & Time Indicator */}
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDateStr}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentTimeStr}</span>
            </span>
          </div>
        </div>

        {/* Note Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Create New Academic Note
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your lecture notes, equations, diagrams, or programming code snippets
              </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving to MongoDB...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Note Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Note Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Java OOP: Polymorphism & Interface Design Patterns"
                className="w-full px-4 py-2.5 text-base sm:text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Subject Category & Pin Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject Category <span className="text-rose-500">*</span>
                </label>
                {!isCustomCategory ? (
                  <div className="flex gap-2">
                    <select
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsCustomCategory(true);
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {allSubjects.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                      <option value="__custom__">+ Add Custom Subject...</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Type custom subject name..."
                      className="flex-1 px-3 py-2 text-sm bg-white border border-indigo-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Preset list
                    </button>
                  </div>
                )}
              </div>

              {/* Pin Note Checkbox */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Priority & Pinning
                </label>
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`w-full flex items-center justify-between px-4 py-2 border rounded-xl text-sm font-semibold transition-colors ${
                    isPinned
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Pin className={`w-4 h-4 ${isPinned ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
                    <span>{isPinned ? 'Pinned to top of dashboard' : 'Not pinned'}</span>
                  </span>
                  <span className="text-xs font-normal opacity-70">
                    {isPinned ? 'Click to unpin' : 'Click to pin'}
                  </span>
                </button>
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Topic Tags (Press Enter to add)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-indigo-400 hover:text-indigo-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={tags.length === 0 ? 'Type tag and press Enter...' : 'Add more...'}
                  className="flex-1 min-w-[120px] bg-transparent text-xs py-1 px-1 focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Description & Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Note Description & Content <span className="text-rose-500">*</span>
                </label>

                {/* Write / Preview Tab Switcher */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      activeTab === 'write' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Write</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      activeTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              {activeTab === 'write' && (
                <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 border border-slate-200 border-b-0 rounded-t-xl text-slate-600">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    title="Bold"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    title="Italic"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ')}
                    title="Heading"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                  >
                    <Heading className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- ')}
                    title="Bullet List"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('```\n', '\n```')}
                    title="Code Block"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ')}
                    title="Quote"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Editor or Preview Pane */}
              {activeTab === 'write' ? (
                <textarea
                  id="note-description-textarea"
                  required
                  rows={12}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed academic notes, code examples, theory, formulas, or summaries..."
                  className="w-full p-4 text-sm font-normal bg-white border border-slate-200 rounded-b-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed"
                />
              ) : (
                <div className="w-full min-h-[300px] p-6 bg-slate-50 border border-slate-200 rounded-xl prose prose-sm max-w-none overflow-y-auto">
                  {description.trim() ? (
                    <div className="whitespace-pre-wrap font-sans text-sm text-slate-800 leading-relaxed">
                      {description}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-xs">Nothing to preview yet. Switch to Write tab to add notes.</p>
                  )}
                </div>
              )}

              {/* Live Status Bar */}
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span>{wordCount} words</span>
                  <span>·</span>
                  <span>{charCount} characters</span>
                  <span>·</span>
                  <span>~{readingTime} min read</span>
                </div>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Database className="w-3.5 h-3.5" />
                  <span>Saves to MongoDB</span>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
